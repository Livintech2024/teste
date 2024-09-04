import ClientController from '../controllers/ClientController';

export const createClient = {
	'router': '/client',
	'controller': ClientController.createClient
};

export const updateClient = {
	'router': '/client',
	'controller': ClientController.updateClient
};

export const findClient = {
	'router': '/client',
	'controller': ClientController.findClient
};

export const deleteClient = {
	'router': '/client/:id',
	'controller': ClientController.deleteClient
};

export const findAllClient = {
	'router': '/clients',
	'controller': ClientController.findAllClient
};