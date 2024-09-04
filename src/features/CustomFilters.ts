import prisma from '../database';



export default {
	async  getRelayModuleByDeviceId(deviceId: number) {
		try {
			const relayModule = await prisma.relayModule.findFirst({
				where: {
					outputs: {
						some: {
							deviceLoad: {
								id: deviceId
							},
						},
					},
				},
			});
			return relayModule;
		}catch(error){
			console.log(error);
		}
		
	},
	async getOutputByDeviceLoadId(deviceId: number){
		try{
			const output = await prisma.outputRelay.findFirst({
				where: {
					deviceLoad: {
						id: deviceId
					}
				}
			});
			return output;
		}catch(error) {
			console.log(error);
		}
		return null;
	},
	async  getDeviceLoadByInputAndModule(moduleMac: string, numInput: number) {
		try {
            
			const relayModule = await prisma.relayModule.findUnique({
				where: {
					moduleMac: moduleMac,
				},
				include: {
					inputs: true, // Incluir os dados relacionados às entradas do RelayModule
				},
			});
      
			if (relayModule === null) {
				return null;
			}
      
       
			const input = relayModule.inputs.find((input) => input.numInput === numInput);
      
			if (input === null) {
				return null;
			}
      
			const deviceLoad = await prisma.deviceLoad.findUnique({
				where: {
					id: input.id
				},
			});
      
			if (deviceLoad === null) {
				return null;
			}
      
			console.log('Device Load:', deviceLoad);
			return deviceLoad;
		} 
		catch (error) {
			console.error('Error retrieving Device Load:', error);
			throw error;
		}
	},
	async getIRGBModuleByDeviceId(deviceId: number){
		try{
			const irgbModule = await prisma.iRGBModule.findFirst({
				where: {
					outputsIR: {
						some: {
							deviceIR: {
								id: deviceId
							}
						}
					}
				}
			});
			return irgbModule;
		}catch(error){
			console.log(error);
			return null;
		}
	},
	async getOutputByDeviceIr(deviceId: number){
		try{
			const output = await prisma.outputIR.findFirst({
				where: {
					deviceIR: {
						id: deviceId
					}
				}
			});
			return output;
		}catch(error){
			console.log(error);
			return null;
		}
	},
	async getRelayModuleByOutputId(outputId: number){
		try{
			const relayModule = await prisma.relayModule.findFirst({
				where: {
					outputs: {
						some: {
							numOutput: outputId
						}
					}
				}
			});
			return relayModule;
		}catch(error){
			console.log(error);
			return null;
		}
	},
	async getRelayModuleByIP(id: number){
		try{
			const relayModule = await prisma.relayModule.findFirst({
				where: {
					id: id
				},
				include: {
					outputs: true
				}
			});

			return relayModule;
		}catch(error){
			console.log(error);
			return null;
		}
	}
    

};