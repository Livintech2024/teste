import AuthController from '../controllers/AuthController';

export const login = {
	'router': '/auth/login',
	'controller': AuthController.login
};

export const register = {
	'router': '/auth/register',
	'controller': AuthController.register
};