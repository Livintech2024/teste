import { getAllOutputRelay, createOutputRelay, updateOutputRelay, deleteOutputRelay } from "../controllers/OutputRelayController"

export const createOutputRelayRouter = {
    'router':'/OutputRelay',
    'controller': createOutputRelay
}

export const updateOutputRelayRouter = {
    'router': '/OutputRelay/:id',
    'controller': updateOutputRelay
}

export const deleteOutputRelayRouter = {
    'router': '/OutputRelay/:id',
    'controller': deleteOutputRelay
}

export const getAllOutputRelayRouter = {
    'router': '/OutputRelay',
    'controller': getAllOutputRelay
}