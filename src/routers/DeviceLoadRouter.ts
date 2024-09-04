import DeviceLoadController from '../controllers/DeviceLoadController';


export const createDeviceLoad = {
	'router': '/deviceload',
	'controller': DeviceLoadController.createDeviceLoad
};

export const deleteDeviceLoad = {
	'router': '/deviceload/:id',
	'controller': DeviceLoadController.deleteDeviceLoad
};

export const updateDeviceLoad = {
	'router': '/deviceload',
	'controller': DeviceLoadController.updateDeviceLoad
};

export const findDeviceLoad = {
	'router': '/deviceload/:id',
	'controller': DeviceLoadController.findDeviceLoad
};

export const findAllDevicesLoad = {
	'router': '/devicesload',
	'controller': DeviceLoadController.findAllDevicesLoad
};