import EventController from '../controllers/EventController';

export const createEvent = {
	'router': '/event',
	'controller': EventController.createEvent
};

export const deleteEvent = {
	'router': '/event/:id',
	'controller': EventController.deleteEvent
};

export const updateEvent = {
	'router': '/event',
	'controller': EventController.updateEvent
};


export const findEvent = {
	'router': '/event/:id',
	'controller': EventController.findEvent
};


export const findAllEvents = {
	'router': '/events',
	'controller': EventController.findAllEvents
};