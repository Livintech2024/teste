import IRGBModuleController from '../controllers/IRGBModuleController';


export const createIRGB = {
	'router': '/irgbmodule',
	'controller': IRGBModuleController.createIRGBModule
};

export const deleteIRGB = {
	'router': '/irgbmodule/:id',
	'controller': IRGBModuleController.deleteIRGBModule
};

export const findIRGB = {
	'router': '/irgbmodule/:id',
	'controller': IRGBModuleController.findIRGBModule
};

export const updateIRGB = {
	'router': '/irgbmodule',
	'controller': IRGBModuleController.updateIRGBModule
};

export const findAllIRGB = {
	'router': '/irgbmodules',
	'controller': IRGBModuleController.findAllIRGBModule
};

export const findAllFromClientIRGB = {
	'router': '/irgbclientmodules',
	'controller': IRGBModuleController.findAllClientIRGBModule
}
