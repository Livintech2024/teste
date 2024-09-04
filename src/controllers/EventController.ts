import prisma from '../database';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import CustomFilters from '../features/CustomFilters';
import { SendCommandToModule } from '../services/mqtt';
import { ModuleCommand } from '../interfaces';


export default {
	async createEvent(request: Request, response: Response) {

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


			const { eventName, deviceIrId, deviceLoadId,
				inputId, sceneId, startTime, endTime,
				eventType, isInstantaneos, inputType, outputId, value, moduleIP, moduleMac } = request.body;

			console.log(request.body);
			if (deviceLoadId != null) {
				if (eventType === 'Invert') {
					const relayModule = await CustomFilters.getRelayModuleByDeviceId(deviceLoadId);
					const output = await CustomFilters.getOutputByDeviceLoadId(deviceLoadId);
					const numOutput = output.numOutput % 11;
					const command: ModuleCommand = {
						commandType: 'SetOutput',
						data: {
							out: numOutput === 0 ? 1 : numOutput,
							level: !output.outputState,
						}
					};
					console.log(output);

					SendCommandToModule(relayModule.moduleMac, command);
					const updatedOutput = await prisma.outputRelay.update({
						where: {
							id: output.id
						},
						data: {
							outputState: !output.outputState
						}
					});
					console.log(updatedOutput);
				} else if (eventType === 'On') {
					console.log('');
				} else if (eventType === 'Off') {
					console.log('');
				}
				else if (eventType === 'Timed') {
					console.log('');
				}
				else if (eventType === 'OpenCurtain') {
					const relayModule = await CustomFilters.getRelayModuleByDeviceId(deviceLoadId);
					const output = await CustomFilters.getOutputByDeviceLoadId(deviceLoadId);
					if (output.outputFunction === 'Open-Curtain') {
						if (output.timeOn > 0) {
							const numOutput = output.numOutput % 11;
							const command: ModuleCommand = {
								commandType: 'SetOutputTimed',
								data: {
									outputNum: numOutput === 0 ? 1 : numOutput,
									time: output.timeOn
								}
							};

							SendCommandToModule(relayModule.moduleMac, command);
						}
					}

				}
				else if (eventType === 'CloseCurtain') {
					const relayModule = await CustomFilters.getRelayModuleByDeviceId(deviceLoadId);
					const output = await CustomFilters.getOutputByDeviceLoadId(deviceLoadId);
					if (output.outputFunction === 'Close-Curtain') {
						if (output.timeOn > 0) {
							const numOutput = output.numOutput % 11;
							const command: ModuleCommand = {
								commandType: 'SetOutputTimed',
								data: {
									outputNum: numOutput === 0 ? 1 : numOutput,
									time: output.timeOn
								}
							};

							SendCommandToModule(relayModule.moduleMac, command);
						}

					} else {
						console.log('Time on not setted');
					}
				}
			}
			else if (deviceIrId != null) {
				const irgbModule = await CustomFilters.getIRGBModuleByDeviceId(deviceIrId);
				console.log(irgbModule);
				const output = await CustomFilters.getOutputByDeviceIr(deviceIrId);
				console.log(output);
				if (output.outputType === 'RGB-PWM' || output.outputType === 'RGB-E') {
					if (eventType === 'SetColor') {
						const command: ModuleCommand = {
							commandType: 'SetColor',
							data: {
								outputNum: output.outputType === 'RGB-PWM' ? 2 : 1,
								color: value
							}
						};
						SendCommandToModule(irgbModule.moduleMac, command);
						console.log(output);
					}
				}
				else if (output.outputType === 'IR') {
					const deviceIR = await prisma.deviceIR.findUnique({
						where: {
							id: deviceIrId
						}
					});
					console.log(deviceIR);
					if (eventType === 'toogleTv') {
						const command: ModuleCommand = {
							commandType: 'OnOffTV',
							data: null
						};
						SendCommandToModule(irgbModule.moduleMac, command);
					}
					else if (eventType === 'IncreaseTv') {
						const command: ModuleCommand = {
							commandType: 'IncreaseTv',
							data: null
						};
						SendCommandToModule(irgbModule.moduleMac, command);
					}
					else if (eventType === 'DecreaseTv') {
						const command: ModuleCommand = {
							commandType: 'DecreaseTv',
							data: null
						};
						SendCommandToModule(irgbModule.moduleMac, command);
					}
				}
			}
			else if (deviceIrId === null && deviceLoadId === null) {

				if (eventType === 'Invert') {
					const relayModule = await CustomFilters.getRelayModuleByIP(moduleIP);
					const outputFound = relayModule.outputs.find(output => output.id === outputId);
					const numOutput = outputFound.numOutput % 11;
					const command: ModuleCommand = {
						commandType: 'SetOutput',
						data: {
							out: numOutput === 0 ? 1 : numOutput,
							level: outputFound.outputState
						}
					};

					SendCommandToModule(relayModule.moduleMac, command);
				}

			}

			const event = await prisma.event.create({
				data: {
					userId: userId,
					deviceIrId: deviceIrId,
					deviceLoadId: deviceLoadId,
					eventType: eventType,
					endTime: endTime,
					startTime: startTime,
					inputId: inputId,
					isInstantaneos: isInstantaneos,
					sceneId: sceneId,
					eventName: eventName,
					inputType: inputType,
					outputId: outputId,
				}
			});
			return response.json({
				error: false,
				message: 'Success: Evento criado com sucesso !',
				event
			});
		} catch (error) {
			return response.json({ message: error.message });
		}
	},
	async updateEvent(request: Request, response: Response) {
		try {
			const { id, deviceIrId, deviceLoadId, inputId,
				sceneId, startTime, endTime,
				eventType, isInstantaneos, eventName, inputType, outputId } = request.body;
			const eventExist = await prisma.event.findUnique({
				where: {
					id: Number(id)
				}
			});

			if (!eventExist) {
				return response.json({
					error: true,
					message: 'Error: Evento não existe !'
				});
			}

			const event = await prisma.event.update({
				where: {
					id: Number(id)
				},
				data: {
					deviceIrId: deviceIrId,
					deviceLoadId: deviceLoadId,
					eventType: eventType,
					endTime: endTime,
					startTime: startTime,
					inputId: inputId,
					isInstantaneos: isInstantaneos,
					sceneId: sceneId,
					eventName: eventName,
					inputType: inputType,
					outputId: outputId
				}
			});
			return response.json({
				error: false,
				message: 'Success: Evento atualizado com sucesso !',
				event
			});

		} catch (error) {
			return response.json({ message: error.message });
		}
	},
	async deleteEvent(request: Request, response: Response) {
		try {
			const { id } = request.params;
			const eventExist = await prisma.event.findUnique({
				where: {
					id: Number(id)
				}
			});

			if (!eventExist) {
				return response.json({
					error: true,
					message: 'Error: Evento não existe !'
				});
			}

			const event = await prisma.event.delete({
				where: {
					id: Number(id)
				}
			});

			return response.json({
				error: false,
				message: 'Success: Evento deletado com sucesso !',
				event
			});

		} catch (error) {
			return response.json({ message: error.message });
		}
	},
	async findEvent(request: Request, response: Response) {
		try {
			const { id } = request.params;
			const event = await prisma.event.findUnique({
				where: {
					id: Number(id)
				}
			});

			if (!event) {
				return response.json({
					error: true,
					message: 'Error: Evento não existe !'
				});
			}

			return response.json({
				error: false,
				message: 'Success: Evento encontrado com sucesso !',
				event
			});

		} catch (error) {
			return response.json({ message: error.message });
		}
	},
	async findAllEvents(request: Request, response: Response) {
		try {
			const events = await prisma.event.findMany({
				include: {
					deviceIR: true,
					input: true,
					deviceLoad: true
				}
			});

			return response.json({
				error: false,
				message: `Success: ${events.length} eventos encontrados com sucesso !`,
				events
			});

		} catch (error) {
			return response.json({ message: error.message });
		}
	}
};