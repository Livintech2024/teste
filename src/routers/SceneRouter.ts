import SceneController from '../controllers/SceneController';


export const createScene = {
	'router': '/scene',
	'controller': SceneController.createScene
};

export const deleteScene = {
	'router': '/scene/:id',
	'controller': SceneController.deleteScene
};


export const updateScene = {
	'router': '/scene',
	'controller': SceneController.updateScene
};


export const findScene = {
	'router': '/scene/:d',
	'controller': SceneController.findScene
};

export const findAllScenes = {
	'router': '/scenes',
	'controller': SceneController.findAllScenes
};

export const findAllUserScenes = {
	'router': '/userscenes',
	'controller': SceneController.findAllUserScenes
}