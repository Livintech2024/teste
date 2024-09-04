import RelayModuleController from '../controllers/RelayModuleController';


export const createRelayModule = {
	'router': '/relaymodule',
	'controller': RelayModuleController.createRelayModule
};

export const createRelayModuleInputOutput = {
	'router': '/relayModuleOutInput',
	'controller': RelayModuleController.createRelayModuleInputOutput
}

export const updateRelayModule = {
	'router': '/relaymodule',
	'controller': RelayModuleController.updateRelayModule
};

export const deleteRelayModule = {
	'router': '/relaymodule/:id',
	'controller': RelayModuleController.deleteRelayModule
};

export const findRelayModule = {
	'router': '/relaymodule/:id',
	'controller': RelayModuleController.findRelayModule
};

export const findAllRelayModules = {
	'router': '/relaymodules',
	'controller': RelayModuleController.findAllModules
};

export const findAllClientRelayModules = {
	'router': '/clientrelaymodules',
	'controller': RelayModuleController.findAllClientModules
};
