import prisma from '../database';
import jwt from 'jsonwebtoken'
import {Request, Response} from 'express';



export default {
	async createDeviceLoad(request: Request, response: Response){
		try{
			const {spaceId, loadType, deviceName, outputId, inputId, inputTrigger, pairId} = request.body;

			console.log(request.body);
            
			const deviceExist = await prisma.deviceLoad.findUnique({
				where: {
					deviceName: deviceName,
					outputId: Number(outputId)
				}
			});
			console.log(inputTrigger, inputId);
            
			if(deviceExist){
				return response.json({
					error: true,
					message: 'Error: Dispositivo já existe !'
				});
			}

			const deviceLoad = await prisma.deviceLoad.create({
				data: {
					deviceName: deviceName,
					deviceType: loadType,
					spaceId: spaceId,
					outputId: outputId,
					inputId: inputId,
					inputTrigger: inputTrigger,
					pairId: pairId
				}
			});

			return response.json({
				error: false,
				message: 'Success: Dispositivo criado com sucesso !',
				deviceLoad
			});
		}catch(error){
			return response.json({message: error.message});
		}
	},
	async updateDeviceLoad(request: Request, response: Response){
		try{
			const { id, spaceId, loadType, deviceName, status, inputId, inputTrigger} = request.body;
			const deviceExist = await prisma.deviceLoad.findUnique({
				where:{
					id: Number(id)
				}
			});

			if(!deviceExist){
				return response.json({
					error: true,
					message: 'Error: Dispositivo não existe !'
				});
			}

			const deviceLoad = await prisma.deviceLoad.update({
				where: {
					id: Number(id)
				},
				data: {
					spaceId: spaceId,
					deviceType: loadType,
					status: status,
					deviceName: deviceName,
					inputId: inputId,
					inputTrigger: inputTrigger
				}
			});

			return response.json({
				error: false,
				message: 'Success: Dispositivo atualizado com sucesso !',
				deviceLoad
			});

		}catch(error){
			return response.json({message: error.message});
		}
	},
	async deleteDeviceLoad(request: Request, response: Response){
		try{
			const { id } =  request.params;

			const deviceExist = await prisma.deviceLoad.findUnique({
				where: {
					id: Number(id)
				}
			});

			if(!deviceExist){
				return response.json({
					error: true,
					message: 'Error: Dispositivo não existe !'
				});
			}

			const deviceLoad = await prisma.deviceLoad.delete({
				where: {
					id: Number(id)
				}
			});
			return response.json({
				error: false,
				message: 'Success: Dispositivo deletado com sucesso !',
				deviceLoad
			});
		}catch(error){
			return response.json({message: error.message});
		}
	},
	async findDeviceLoad(request: Request, response: Response){
		try{
			const { id } = request.params;
			const deviceLoad = await prisma.deviceLoad.findUnique({
				where: {
					id: Number(id)
				}
			});
			if(!deviceLoad){
				return response.json({
					error: true,
					message: 'Error: Dispositivo não existe !'
				});
			}
			return response.json({
				error: false,
				message: 'Success: Dispositivo encontrado com sucesso !',
				deviceLoad
			});

		}catch(error){
			return response.json({message: error.message});
		}
	},
	async findAllDevicesLoad(request: Request, response: Response){
		try{
			
			const devicesLoad = await prisma.deviceLoad.findMany({include:{
				space:true,
				input: true
			}});

			return response.json({
				error: false,
				message: `Success: ${ devicesLoad.length } dispositivos de carga encontrados com sucesso !`,
				devicesLoad
			});

		}catch(error){
			return response.json({message: error.message});
		}
	}
};