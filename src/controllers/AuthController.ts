import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../database';
import { Request, Response } from 'express';

export default {

	async login(req: Request, res: Response) {
        interface LoginRequestBody {
            email: string;
            password: string;
        }

        //Descobrir se o usuário existe
        const { email, password } = req.body as LoginRequestBody; // Tipo explícito ou cast
        const clientExist = await prisma.client.findUnique({ where: { email } });
		const usingUserRoot = await prisma.user.findUnique({ where: { email }})

		if(usingUserRoot){

			//Checking password
			const checkPassword = bcrypt.compareSync(password, usingUserRoot.password);

			if (!checkPassword) return res.status(403).json('Senha incorreta!');
			const userOfClient = await prisma.user.findUnique({where: {id : usingUserRoot.id}})
	
			//token
			const token = jwt.sign({ id: usingUserRoot.id }, 'secret_key');
	
	
			return res.status(200).json({ token: token, message: 'Usuário logado!' });
		}else{
			if (!clientExist) return res.status(404).json('Cliente não encontrado!');
			//Checking password
			const checkPassword = bcrypt.compareSync(password, clientExist.password);

			if (!checkPassword) return res.status(403).json('Senha incorreta!');
			const userOfClient = await prisma.user.findUnique({where: {id : clientExist.userId}})
	
			//token
			const token = jwt.sign({ id: userOfClient.id }, 'secret_key');
	
	
			return res.status(200).json({ token: token, message: 'Cliente logado!' });
		}

        
	},

	async register(request: Request, response: Response) {
		try {
			const { name, email, avatar, password, isAdmin } = request.body;

			const userExist = await prisma.user.findUnique({ where: { email } });

			if (userExist) {
				return response.status(401).json({
					error: true,
					message: 'Error: Usuário já existe!',
				});
			}
			//Creating hash password
			const salt = bcrypt.genSaltSync(12);
			const hashPassword = bcrypt.hashSync(password, salt);

			//Creating user

			const user = await prisma.user.create({
				data: {
					email: email,
					name: name,
					isAdmin: isAdmin,
					avatar: avatar,
					password: hashPassword,
				},
			});

			// Gere o token ao criar um novo usuário
			const token = jwt.sign({ id: user.id }, 'secret_key');

			return response.status(201).json({
				error: false,
				message: 'Success: Usuário criado com sucesso!',
				user,
				token,
			});
		} catch (error) {
			return response.json({ message: error.message });
		}
	},
};