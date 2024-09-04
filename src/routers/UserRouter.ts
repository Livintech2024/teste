import UserController from '../controllers/UserController';


export const createUser = {
	'router': '/user',
	'controller': UserController.createUser
};

export const updateUser = {
	'router': '/user',
	'controller': UserController.updateUser
};

export const findUser = {
	'router': '/user',
	'controller': UserController.findUser
};

export const deleteUser = {
	'router': '/user/:id',
	'controller': UserController.deleteUser
};

export const findAllUser = {
	'router': '/users',
	'controller': UserController.findAllUser
};