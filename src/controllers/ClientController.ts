// userController.ts
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import prisma from '../database';
import bcrypt from 'bcrypt'

export default {
	async createClient(request: Request, response: Response) {
		try {
			const { userId, name, email, avatar, password, id } = request.body;

			const clientUserId = await prisma.client.findMany({ where: { userId: userId } });
			const clientNameAlreadyExist = clientUserId.some(item=> item.name === name) || clientUserId.some(item=> item.email === email)
			const userExist = await prisma.user.findUnique({ where: { email } });
			const userExists = await prisma.user.findUnique({ where: { id: userId } });
			//Email do cliente não pode ser igual ao email de qualquer usuário já existente


			if (clientNameAlreadyExist) {
				return response.json({
					error: true,
					message: 'Error: Cliente com mesmo nome ou email já existe!',
				});
			}else if(!userExists){
				return response.json({
					error:true,
					message: 'Error: Usuário do userId não existe'
				})
			}else if(userExists.name === name || userExists.email === email){
				return response.json({
					error: true,
					message: 'Error: Não é possível cadastrar o cliente com mesmo email do usuário!',
				});
			}else if(userExist){
				return response.json({
					error: true,
					message: 'Error: Email do cliente já pertence a um usuário!',
				});
			}

			//Creating hash password
			const salt = bcrypt.genSaltSync(12);
			const hashPassword = bcrypt.hashSync(password, salt);


			const client = await prisma.client.create({
				data: {
                    userId: userId,
					email: email,
					name: name,
					avatar: avatar,
					password: hashPassword,
				},
			});

			// Gere o token ao criar um novo cliente
            
			const token = jwt.sign({ id: client.id }, 'secret_key');

			return response.json({
				error: false,
				message: 'Success: Cliente criado com sucesso!',
				client,
				token,
			});
		} catch (error) {
			return response.json({ message: error.message });
		}
	},

	async deleteClient(request: Request, response: Response) {
		try {
			const { id } = request.params;
			const clientExist = await prisma.client.findUnique({ where: { id: Number(id) } });

			if (!clientExist) {
				return response.json({
					error: true,
					message: 'Error: Cliente não existe!',
				});
			}

			const client = await prisma.client.delete({
				where: { id: Number(id) },
			});

			return response.json({
				error: false,
				message: 'Success: Cliente excluído com sucesso!',
				client,
			});
		} catch (error) {
			return response.json({ message: error.message });
		}
	},

	async findClient(request: Request, response: Response) {
		try {
			let clientId;
			const clientToken = request.headers['authorization'];

            
			console.log("testeee:", clientToken);
			

            jwt.verify(clientToken, 'secret_key', (erro, decoded) => {
				if (erro) console.error('Erro ao verificar o JWT:', erro.message);// Tratar o erro, por exemplo, token expirado, assinatura inválida, etc.

				// As informações do JWT estão no objeto "decoded"
				// Acessando id do usuário
				clientId = decoded.id;
				console.log(clientId);
			});

			const client = await prisma.client.findUnique({ where: { id: Number(clientId) } });

			if (client == null) {
				return response.json({
					error: true,
					message: 'Error: Cliente não existe!',
				});
			}

			return response.json({
				error: false,
				message: 'Success: Cliente encontrado com sucesso!',
				client,
			});
		} catch (error) {
			return response.json({ message: error.message });
		}
	},

	async updateClient(request: Request, response: Response) {
		try {
			const { id,userId, name, email, avatar, isAdmin, password } = request.body;
			const clientExist = await prisma.client.findUnique({ where: { id: Number(id) } });

			if (!clientExist) {
				return response.json({
					error: true,
					message: 'Error: Cliente não existe!',
				});
			}

			const client = await prisma.client.update({
				where: { id: Number(id) },
				data: {
                    userId:userId,
					name: name,
					email: email,
					avatar: avatar,
					isAdmin: isAdmin,
					password: password,
				},
			});

			return response.json({
				error: false,
				message: 'Success: Cliente atualizado com sucesso!',
				client,
			});
		} catch (error) {
			return response.json({ message: error.message });
		}
	},

	async findAllClient(request: Request, response: Response) {
		try {
			const clients = await prisma.client.findMany({});
			return response.json({
				error: false,
				message: 'Success: Clientes encontrados!',
				clients,
			});
		} catch (error) {
			return response.json({ message: error.message });
		}
	},
};