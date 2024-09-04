import ItemController from '../controllers/AWSS3Controller'

export const getItem = {
    'router': '/item',
    'controller': ItemController.getItem
}

export const postItem = {
	'router': '/item',
	'controller': ItemController.postItem
};

export const deleteItem = {
	'router': '/item/:id',
	'controller': ItemController.deleteItem
};

export const updateItem = {
	'router': '/item',
	'controller': ItemController.updateItem
};
