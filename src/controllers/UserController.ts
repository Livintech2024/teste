// userController.ts
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import prisma from '../database';
import { generateToken } from '../database/auth';

export default {
	async createUser(request: Request, response: Response) {
		try {
			const { name, email, avatar, password, isAdmin } = request.body;

			const userExist = await prisma.user.findUnique({ where: { email } });

			if (userExist) {
				return response.json({
					error: true,
					message: 'Error: Usuário já existe!',
				});
			}

			const user = await prisma.user.create({
				data: {
					email: email,
					name: name,
					isAdmin: isAdmin,
					avatar: avatar,
					password: password,
				},
			});

			// Gere o token ao criar um novo usuário
			const token = generateToken(user.id, user.name);

			return response.json({
				error: false,
				message: 'Success: Usuário criado com sucesso!',
				user,
				token,
			});
		} catch (error) {
			return response.json({ message: error.message });
		}
	},

	async deleteUser(request: Request, response: Response) {
		try {
			const { id } = request.params;
			const userExist = await prisma.user.findUnique({ where: { id: Number(id) } });

			if (!userExist) {
				return response.json({
					error: true,
					message: 'Error: Usuário não existe!',
				});
			}

			const user = await prisma.user.delete({
				where: { id: Number(id) },
			});

			return response.json({
				error: false,
				message: 'Success: Usuário excluído com sucesso!',
				user,
			});
		} catch (error) {
			return response.json({ message: error.message });
		}
	},

	async findUser(request: Request, response: Response) {
		try {
			let userId;
			const userToken = request.headers['authorization'];


			jwt.verify(userToken, 'secret_key', (erro, decoded) => {
				if (erro) console.error('Erro ao verificar o JWT:', erro.message);// Tratar o erro, por exemplo, token expirado, assinatura inválida, etc.

				// As informações do JWT estão no objeto "decoded"
				// Acessando id do usuário
				userId = decoded.id;
				console.log(userId);
			});
            
			const user = await prisma.user.findUnique({ where: { id: Number(userId) } });

			if (user == null) {
				return response.json({
					error: true,
					message: 'Error: Usuário não existe!',
				});
			}

			return response.json({
				error: false,
				message: 'Success: Usuário encontrado com sucesso!',
				user,
			});
		} catch (error) {
			return response.json({ message: error.message });
		}
	},

	async updateUser(request: Request, response: Response) {
		try {
			const { id, name, email, avatar, isAdmin, password } = request.body;
			const userExist = await prisma.user.findUnique({ where: { id: Number(id) } });

			if (!userExist) {
				return response.json({
					error: true,
					message: 'Error: Usuário não existe!',
				});
			}

			const user = await prisma.user.update({
				where: { id: Number(id) },
				data: {
					name: name,
					email: email,
					avatar: avatar,
					isAdmin: isAdmin,
					password: password,
				},
			});

			return response.json({
				error: false,
				message: 'Success: Usuário atualizado com sucesso!',
				user,
			});
		} catch (error) {
			return response.json({ message: error.message });
		}
	},

	async findAllUser(request: Request, response: Response) {
		try {
			const users = await prisma.user.findMany({});
			return response.json({
				error: false,
				message: 'Success: Usuários encontrados!',
				users,
			});
		} catch (error) {
			return response.json({ message: error.message });
		}
	},
};