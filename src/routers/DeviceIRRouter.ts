import DeviceIRController from '../controllers/DeviceIRController';

export const createDeviceIR = {
	'router': '/deviceir',
	'controller': DeviceIRController.createDeviceIR
};


export const deleteDeviceIR = {
	'router': '/deviceir/:id',
	'controller': DeviceIRController.deleteDeviceIR
};

export const updateDeviceIR = {
	'router': '/deviceir',
	'controller': DeviceIRController.updateDeviceIR
};

export const findDeviceIR = {
	'router': '/deviceir/:id',
	'controller': DeviceIRController.findDeviceIR
};

export const findAllDevicesIR = {
	'router': '/devicesir',
	'controller': DeviceIRController.findAllDevicesIR
};