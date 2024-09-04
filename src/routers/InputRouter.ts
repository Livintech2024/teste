import InputController from '../controllers/InputController';


export const createInput = {
	'router': '/input',
	'controller': InputController.createInput
};

export const deleteInput = {
	'router': '/input/:id',
	'controller': InputController.deleteInput
};

export const updateInput = {
	'router': '/input',
	'controller': InputController.updateInput
};

export const findInput = {
	'router': '/input/:id',
	'controller': InputController.findInput
};

export const findAllInput = {
	'router': '/inputs',
	'controller': InputController.findAllInput
};