import ImageController from '../controllers/ImageController'

export const getImage = {
    'router': '/image',
    'controller': ImageController.getImage
}

export const postImage = {
	'router': '/image',
	'controller': ImageController.postImage
};

export const deleteImage = {
	'router': '/image/:id',
	'controller': ImageController.deleteImage
};

export const updateImage = {
	'router': '/image',
	'controller': ImageController.updateImage
};
