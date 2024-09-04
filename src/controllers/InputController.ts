import prisma from '../database';
import {Request, Response} from  'express';


export default {
	async createInput(request: Request, response: Response){
		try{
			const {numInput, relayModuleId } = request.body;

			// const inputExist = await prisma.input.findUnique({
			// 	where: {
			// 		numInput: Number(numInput)
			// 	}
			// });

			// if(inputExist){
			// 	return response.json({
			// 		error: true,
			// 		message: 'Error: Entrada já utilizada !'
			// 	});
			// }
            const date = new Date()

			const input = await prisma.input.create({
				data: {
					numInput: numInput,
					relayModuleId: Number(relayModuleId),
				}
			});

			return response.json({
				error: false,
				message: 'Success: Entrada criado com sucesso !',
				input
			});

		}
		catch(error){
			return response.json({message: error.message});
		}
	},

	async deleteInput(request: Request, response: Response){
		try{
			const { id } = request.params;
			const inputExist = await prisma.input.findUnique({
				where: {
					id: Number(id)
				}
			});
			if(!inputExist){
				return response.json({
					error: true,
					message: 'Error: Entrada não existe !'
				});
			}

			const input = await prisma.input.delete({
				where: {
					id: Number(id)
				}
			});

			return response.json({
				error: false,
				message: 'Success: Entrada deleta com sucesso !',
				input
			});
		}
		catch(error){
			return response.json({message: error.message});
		}
	},

	async updateInput(request: Request, response: Response){
		try{
			const { id, numInput, relayModuleId} = request.body;
			const inputExist = await prisma.input.findUnique({
				where: {
					id: Number(id),
					// numInput: Number(numInput),
					// relayModuleId: Number(relayModuleId)
				}
			});

			if(!inputExist){
				return response.json({
					error: true,
					message: 'Error: Entrada não existe !'
				});
			}
			const input = await prisma.input.update({
				where: {
					id: Number(id)
				},
				data: {
					numInput: numInput,
					relayModuleId: relayModuleId
				}
			});

			return response.json({
				error: false,
				message: 'Success: Entrada atualizada com sucesso !',
				input
			});

		}catch(error){
			return response.json({message: error.message});
		}
	},

	async findInput(request: Request, response: Response){
		try{
			const { id } = request.params;
			const input = await prisma.input.findUnique({
				where: {
					id: Number(id)
				}
			});

			if(!input){
				return response.json({
					error: true,
					message: 'Error: Entrada não existe !'
				});
			}

			return response.json({
				error: false,
				message: 'Success: Entrada encontrada com sucesso !',
				input
			});
		}catch(error){
			return response.json({message: error.message});
		}
	},

	async findAllInput(request: Request, response: Response){
		try{
			const inputs = await prisma.input.findMany({});

			return response.json({
				error: false,
				message: 'Success: Entradas encontradas com sucesso !',
				inputs
			});
		}catch(error){
			return response.json({message: error.message});
		}
	}
};