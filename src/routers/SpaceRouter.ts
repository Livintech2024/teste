import SpaceController from '../controllers/SpaceController';

export const createSpace = {
	'router': '/space',
	'controller': SpaceController.createSpace
};



export const deleteSpace = {
	'router': '/space/:id',
	'controller': SpaceController.deleteSpace
};

export const updateSpace = {
	'router': '/space',
	'controller': SpaceController.updateSpace,
};


export const findSpace = {
	'router': '/space/:id',
	'controller': SpaceController.findSpace
};

export const findAllSpaces = {
	'router': '/spaces',
	'controller': SpaceController.findAllSpaces
};