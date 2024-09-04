import prisma from '../database';
import jwt from 'jsonwebtoken';
import {Request, Response} from 'express';

export default {
	async createIRGBModule(request: Request, response: Response){

		let userId;
		const userToken = request.headers['authorization'];
		console.log("Header da requisição: ", request.headers['authorization'])

		jwt.verify(userToken, 'secret_key',(error, decoded)=>{
			if (error) console.error('Erro ao verificar o JWT:', error.message);// Tratar o erro, por exemplo, token expirado, assinatura inválida, etc.

			// As informações do JWT estão no objeto "decoded"
			// Acessando id do usuário
			userId = decoded.id;
			console.log(userId);
		})

		try{
			const {moduleName, moduleState, moduleStatus, moduleMac, moduleIP } = request.body;
			const moduleExist = await prisma.iRGBModule.findUnique({
				where: {
					moduleMac: moduleMac,
				}
			});
            
			if(moduleExist){
				return response.json({
					error: true,
					message: 'Error: Module já existe !'
				});
			}

			const moduleRGB = await prisma.iRGBModule.create({
				data: {
					userId: userId,
					moduleMac: moduleMac,
					moduleName: moduleName, 
					moduleState: moduleState,
					moduleStatus: moduleStatus,
				}
			});

			return response.json({
				error: false,
				message: 'Success: Módulo RGB criado com sucesso !',
				moduleRGB
			});

		}catch(error){
			return response.json({message: error.message});
		}
	},

	async deleteIRGBModule(request: Request, response: Response){
		try{
			const { id } = request.params;
			const moduleExist = await prisma.iRGBModule.findUnique({
				where: {
					id: Number(id),
				}
			});
            
			if(!moduleExist){
				return response.json({
					error: true,
					message: 'Error: Module não existe !'
				});
			}
			const deleteAllModuleOutputs = await prisma.outputIR.deleteMany({where:{irgbModuleId: Number(id)}})
			const moduleRGB = await prisma.iRGBModule.delete({
				where: {
					id: Number(id)
				}
			});
            
			return response.json({
				error: false,
				message: 'Success: Módulo RGB deletado com sucesso !',
				moduleRGB
			});

		}catch(error){
			return response.json({message: error.message});
		}
	},

	async findIRGBModule(request: Request, response: Response){
		try{
			const { id } = request.params;
			const moduleIRGB = await prisma.iRGBModule.findUnique({
				where: {
					id: Number(id),
				}
			});
            
			if(!moduleIRGB){
				return response.json({
					error: true,
					message: 'Error: Module não existe !'
				});
			}

			return response.json({
				error: false,
				message: 'Success: Módulo RGB encontrado com sucesso !',
				moduleIRGB
			});

		}catch(error){
			return response.json({message: error.message});
		}
	},

	async updateIRGBModule(request: Request, response: Response){
		try{
			const { id, moduleName, moduleState, moduleStatus, moduleMac, moduleIP } = request.body;
			const moduleExist = await prisma.iRGBModule.findUnique({
				where: {
					id: Number(id),
				}
			});
            
			if(!moduleExist){
				return response.json({
					error: true,
					message: 'Error: Module não existe !'
				});
			}

			const moduleRGB = await prisma.iRGBModule.update({
				where: {
					id: Number(id)
				},
				data: {
					moduleMac: moduleMac,
					moduleName: moduleName,
					moduleState: moduleState,
					moduleStatus: moduleStatus,
				}
			});

			return response.json({
				error: false,
				message: 'Success: Módulo RGB atualizado com sucesso !',
				moduleRGB
			});

		}catch(error){
			return response.json({message: error.message});
		}
	},
	async findAllIRGBModule(request: Request, response: Response){
		try{
			const irgbModules = await prisma.iRGBModule.findMany({});
            
			return response.json({
				error: false,
				message: 'Success: Módulos RGB com sucesso !',
				irgbModules
			});

		}catch(error){
			return response.json({message: error.message});
		}
	},
	async findAllClientIRGBModule(request: Request, response: Response){
		let userId;
		const userToken = request.headers['authorization'];

		jwt.verify(userToken, 'secret_key',(error, decoded)=>{
			if (error) console.error('Erro ao verificar o JWT:', error.message);// Tratar o erro, por exemplo, token expirado, assinatura inválida, etc.

			// As informações do JWT estão no objeto "decoded"
			// Acessando id do usuário
			userId = decoded.id;
		})

		try{
			const irgbModules = await prisma.iRGBModule.findMany({
				where:{
					userId:userId
				},
				include: {
					outputsIR: true 
				}
			});
            
			return response.json({
				error: false,
				message: 'Success: Módulos RGB com sucesso !',
				irgbModules
			});

		}catch(error){
			return response.json({message: error.message});
		}
	}
};