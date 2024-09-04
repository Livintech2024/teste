import prisma from '../database';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export default {
	async createRelayModule(request: Request, response: Response) {

		let userId;
		const userToken = request.headers['authorization'];
		console.log("Header da requisição: ", request.headers['authorization'])

		jwt.verify(userToken, 'secret_key', (error, decoded) => {
			if (error) console.error('Erro ao verificar o JWT:', error.message);// Tratar o erro, por exemplo, token expirado, assinatura inválida, etc.

			// As informações do JWT estão no objeto "decoded"
			// Acessando id do usuário
			userId = decoded.id;

		})

		try {
			console.log("id do usuário: ", userId);
			const { moduleName, moduleState, moduleStatus, moduleMac } = request.body;
			const moduleExist = await prisma.relayModule.findUnique({
				where: { moduleMac: moduleMac }
			});
			if (moduleExist) {
				return response.json({
					error: true,
					message: 'Error: Modulo já existe !'
				});
			}
			console.log(userId)
			const relayModule = await prisma.relayModule.create({
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
				message: 'Success: Módulo criado com sucesso !',
				relayModule
			});


		} catch (error) {
			return response.json({ message: error.message });
		}
	},
	async createRelayModuleInputOutput(request: Request, response: Response) {

		let userId;
		const userToken = request.headers['authorization'];
		console.log("Header da requisição: ", request.headers['authorization'])

		jwt.verify(userToken, 'secret_key', (error, decoded) => {
			if (error) console.error('Erro ao verificar o JWT:', error.message);// Tratar o erro, por exemplo, token expirado, assinatura inválida, etc.

			// As informações do JWT estão no objeto "decoded"
			// Acessando id do usuário
			userId = decoded.id;

		})

		try {
			console.log("id do usuário: ", userId);
			const { moduleName, moduleState, moduleStatus, moduleMac } = request.body;
			//informações das saídas
			const { relayModuleId, outputFunction, outputType, numOutput, timeOn, createdAt, updatedAt, outputState } = request.body

			const moduleExist = await prisma.relayModule.findUnique({
				where: { moduleMac: moduleMac }
			});
			if (moduleExist) {
				return response.json({
					error: true,
					message: 'Error: Modulo já existe !'
				});
			}
			console.log(userId)
			const relayModule = await prisma.relayModule.create({
				data: {
					userId: userId,
					moduleMac: moduleMac,
					moduleName: moduleName,
					moduleState: moduleState,
					moduleStatus: moduleStatus,
				}
			});

			let outputs;
			for (let i = 0; i < 10; i++) {
				const createOutputRelay = await prisma.outputRelay.create({
					data: {
						relayModuleId: relayModuleId,//Como eu faço para pegar o ID que será gerado pelo banco de dados
						outputFunction: outputFunction,
						outputType: outputType,
						numOutput: i,
						timeOn: timeOn,
						createdAt: createdAt,
						updatedAt: updatedAt,
						outputState: outputState
					}
				})

				outputs = createOutputRelay
			
			}

			return response.json({
				error: false,
				message: 'Success: Módulo criado com sucesso !',
				relayModule: relayModule,
				createOutputRelay: outputs
			});


		} catch (error) {
			return response.json({ message: error.message });
		}
	},

	async deleteRelayModule(request: Request, response: Response) {

		try {
			const { id } = request.params;
			const moduleExist = await prisma.relayModule.findUnique({
				where: { id: Number(id) }
			});

			if (!moduleExist) {
				return response.json({
					error: true,
					message: 'Error: Modulo não existe !'
				});
			}

			const deleteAllModuleOutputs = await prisma.outputRelay.deleteMany({where:{relayModuleId: Number(request.params.id)}})
			const deleteAllModuleInputs = await prisma.input.deleteMany({where:{relayModuleId: Number(request.params.id)}})
			const relayModule = await prisma.relayModule.delete({
				where: { id: Number(id) }
			});

			return response.json({
				error: false,
				message: 'Success: Módulo deletado com sucesso !',
				relayModule,
				saidas_apagadas: deleteAllModuleOutputs,
				inputs_apagados: deleteAllModuleInputs
			});


		} catch (error) {
			return response.json({ message: error.message });
		}
	},
	async findRelayModule(request: Request, response: Response) {
		try {
			const { id } = request.params;
			const relayModule = await prisma.relayModule.findUnique({
				where: { id: Number(id) },
				include: { 
					inputs: true, 
					outputs: true 
				}
			});
			if (relayModule == null) {
				return response.json({
					error: true,
					message: 'Error: Modulo não existe !'
				});
			}

			return response.json({
				error: false,
				message: 'Success: Módulo encontrado com sucesso !',
				relayModule
			});

		} catch (error) {
			return response.json({ message: error.message });
		}
	},
	async updateRelayModule(request: Request, response: Response) {
		try {
			const { id, moduleName, moduleState, moduleMac, moduleIP, moduleStatus } = request.body;

			const moduleExist = await prisma.relayModule.findUnique({
				where: { id: Number(id) }
			});

			if (!moduleExist) {
				return response.json({
					error: true,
					message: 'Error: Modulo não existe !'
				});
			}

			const relayModule = await prisma.relayModule.update({
				where: { id: Number(id) },
				data: {
					moduleName: moduleName,
					moduleState: moduleState,
					moduleMac: moduleMac,
					moduleStatus: moduleStatus,
				}
			});
			return response.json({
				error: false,
				message: 'Success: Módulo atualizado com sucesso !',
				relayModule
			});
		} catch (error) {
			return response.json({ message: error.message });
		}
	},
	async findAllModules(request: Request, response: Response) {
		try {
			const relayModules = await prisma.relayModule.findMany({
				include: {
					outputs: true,
					inputs: true
				}
			});

			return response.json({
				error: false,
				message: 'Success: Módulos encontrados com sucesso !',
				relayModules
			});
		} catch (error) {
			return response.json({ message: error.message });
		}
	},

	async findAllClientModules(request: Request, response: Response) {
		let userId;

		const token = request.headers['authorization']
		jwt.verify(token, 'secret_key', (error, decoded) => {
			if (error) console.error('Erro de autênticação JWT: ', error.message)

			userId = decoded.id
		})

		try {
			const relayModules = await prisma.relayModule.findMany({
				where: {
					userId: userId
				},
				include: {
					outputs: true,
					inputs: true
				}
			});

			return response.json({
				error: false,
				message: 'Success: Módulos encontrados com sucesso !',
				relayModules
			});
		} catch (error) {
			return response.json({ message: error.message });
		}
	}
};
