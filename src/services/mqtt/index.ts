import fs from "fs"
import mqtt from 'mqtt';
import { Request, Response } from 'express';
import { EventInput, Module, ModuleCommand } from '../../interfaces';
import CustomFilters from '../../features/CustomFilters';
import prisma from '../../database';

const EVENT_TOPIC = '/w/modules/event/+';
const DISCOVERY_TOPIC = '/w/modules/discovery';


const modulesPromise: Promise<Module[]> | null = null;
let modulesResolve: (() => void) | null = null;
let modules: Module[] = [];


async function obterModulos(): Promise<Module[]> {
	if (!modulesPromise) {
		// Se a Promise ainda não foi inicializada, cria uma nova Promise resolvida imediatamente
		return Promise.resolve([]);
	}

	return modulesPromise;
}

const mountCommandTopic = (mac: string): string => {
	const command = `/w/mod/${mac}/cmd`;
	return command;
};

const mountConfigTopic = (mac: string): string => {
	const command = `/w/mod/${mac}/cfg`;
	return command;
};

const clientId = 'back-api' + Math.random().toString(16).substring(2, 8);
const cert = fs.readFileSync(__dirname + '/emqxsl-ca.crt');

export const mqttClient = mqtt.connect('mqtts://s1011581.ala.us-east-1.emqxsl.com:8883', {
	password: '*2023goes',
	username: 'liv10',
	protocol: 'mqtts',
	clientId: clientId,
	ca: [cert]
});

mqttClient.on('connect', () => {
	try {
		console.log('MQTT CONNECTED');
		mqttClient.subscribe(DISCOVERY_TOPIC);
		mqttClient.subscribe(EVENT_TOPIC);
	}
	catch (err) {
		console.log("erro MQTT: " + err)
	}
});


mqttClient.on('disconnect', () => {
	console.log('mqtt disconected');
});

mqttClient.on('message', async (topic, payload, packet) => {
	if (topic === '/w/modules/event/input') {
		const event: EventInput = JSON.parse(payload.toString());
		console.log(event);
		const deviceLoad = await CustomFilters.getDeviceLoadByInputAndModule(event.mac, event.inputNum);
		if (deviceLoad != null) {
			const output = await CustomFilters.getOutputByDeviceLoadId(deviceLoad.id);
			if (deviceLoad.inputTrigger === event.inputType) {
				if (deviceLoad.deviceType === 'Light') {
					const command: ModuleCommand = {
						commandType: 'SetOutput',
						data: {
							out: output.numOutput % 11,
							level: !output.outputState,
						}
					};
					
					console.log(output);

					SendCommandToModule(event.mac, command);
					const updatedOutput = await prisma.outputRelay.update({
						where: {
							id: output.id
						},
						data: {
							outputState: !output.outputState
						}
					});
					console.log(updatedOutput);
				}
				else if (deviceLoad.deviceType === 'Curtain') {
					const command: ModuleCommand = {
						commandType: 'SetOutputTimed',
						data: {
							out: output.numOutput % 11,
							level: !output.timeOn,
						}
					};
					console.log(output);

					SendCommandToModule(event.mac, command);
					// const updatedOutput = await prisma.output.update({
					// 	where: {
					// 		id: output.id
					// 	},
					// 	data: {
					// 		outputState: !output.outputState
					// 	}
					// });
					// console.log(updatedOutput);
				}

			}

		}
		console.log(deviceLoad);
	}
	else if (topic === '/w/modules/event/discovery') {
		const module: Module = JSON.parse(payload.toString());

		const moduleExist = modules.some(existingModule => existingModule.mac === module.mac);
		if (!moduleExist) {
			modules.push(module);
			console.log(module);
		}


		if (modulesResolve) {
			modulesResolve();
			modulesResolve = null;
		}
	}
});


export const DiscoveryModules = async (request: Request, response: Response) => {
	try {
		const command: ModuleCommand = {
			commandType: 'IsThereSomebody',
			data: null
		};
		mqttClient.publish(DISCOVERY_TOPIC, JSON.stringify(command));

		if (!modules.length) {
			await new Promise<void>((resolve) => {
				modulesResolve = resolve;
				setTimeout(() => {
					if (modulesResolve) {
						modulesResolve();
						modulesResolve = null;
					}
				}, 5000);
			});
		}

		const modulesFind = modules;
		modules = [];


		console.log(modulesFind);


		return response.json({
			error: false,
			message: 'Success: modulos ok !',
			modulesFind
		});
	} catch (error) {
		console.log(error);
	}
};


export const mqttAlive = (request: Request, response: Response) => {
	try {
		const mqttState = mqttClient.connected ? 'connected' : 'disconnected';

		return response.json({
			error: false,
			message: `Success Livintech is ${mqttState} to broker mqtt`
		});
	}
	catch (error) {
		return response.json({ message: error.message });
	}
};

export const SendCommandToModule = (mac: string, command: ModuleCommand) => {
	const topic = mountCommandTopic(mac);

	try {
		mqttClient.publish(topic, JSON.stringify(command));
	}
	catch (error) {
		console.log(error);
	}
};