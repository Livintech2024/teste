import prisma from '../database';
import {Request, Response} from 'express';



export default {
	async createDeviceIR(request: Request, response: Response){
		try{
			const {deviceName,spaceId, inputId, inputTrigger, deviceIrType, outputIrId} = request.body;
			const deviceIRExist = await prisma.deviceIR.findUnique({
				where: {
					outputIrId: Number(outputIrId)
				}
			});

			if(deviceIRExist){
				return response.json({
					error: true,
					message: 'Error: Dispositivo já existe !'
				});
			}

			const deviceIR = await prisma.deviceIR.create({
				data: {
					deviceName: deviceName,
					deviceIrType: deviceIrType,
					spaceId: spaceId,
					outputIrId: outputIrId,
					inputId: inputId,
					inputTrigger: inputTrigger
				}
			});

			return response.json({
				error: false,
				message: 'Success: Dispositivo criado com sucesso !',
				deviceIR
			});
		}catch(error){
			return response.json({message: error.message});
		}
	},
	async updateDeviceIR(request: Request, response: Response){
		try{
			const { id, spaceId, inputId, inputTrigger, irType, outputId} = request.body;
			const deviceIRExist = await prisma.deviceIR.findUnique({
				where: {
					id: Number(id)
				}
			});

			if(!deviceIRExist){
				return response.json({
					error: true,
					message: 'Error: Dispositivo não existe !'
				});
			}

			const deviceIR = await prisma.deviceIR.update({
				where: {
					id: Number(id)
				},
				data: {
					inputId: inputId,
					inputTrigger: inputTrigger,
					deviceIrType: irType,
					spaceId: spaceId,
					outputIrId: outputId
				}
			});

			return response.json({
				error: false,
				message: 'Success: Dispositivo atualizado com sucesso !',
				deviceIR
			});
		}catch(error){
			return response.json({message: error.message});
		}
	},
	async deleteDeviceIR(request: Request, response: Response){
		try{
			const { id } = request.params;
			const deviceIRExist = await prisma.deviceIR.findUnique({
				where: {
					id: Number(id)
				}
			});

			if(!deviceIRExist){
				return response.json({
					error: true,
					message: 'Error: Dispositivo não existe !'
				});
			}

			const deviceIR = await prisma.deviceIR.delete({
				where: {
					id: Number(id)
				}
			});

			return response.json({
				error: false,
				message: 'Success: Dispositivo deletado com sucesso !',
				deviceIR
			});
            
		}catch(error){
			return response.json({message: error.message});
		}
	},
	async findDeviceIR(request: Request, response: Response){
		try{
			const { id } = request.params;
			const deviceIRExist = await prisma.deviceIR.findUnique({
				where: {
					id: Number(id)
				}
			});

			if(!deviceIRExist){
				return response.json({
					error: true,
					message: 'Error: Dispositivo não existe !'
				});
			}

			return response.json({
				error: false,
				message: 'Success: Dispositivo encontrado com sucesso !',
				deviceIRExist
			});
		}catch(error){
			return response.json({message: error.message});
		}
	},
	async findAllDevicesIR(request: Request, response: Response){
		try{
			const devicesIR = await prisma.deviceIR.findMany({include:{
				space:true,
			}});

			return response.json({
				error: false,
				message: `Success: ${ devicesIR.length } dispositivos de IRGB encontrados com sucesso !`,
				devicesIR
			});
		}catch(error){
			return response.json({message: error.message});
		}
	}
};