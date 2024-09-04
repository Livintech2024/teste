import { getAllOutputIr, createOutputIr, updateOutputIRGB } from "../controllers/OutputIrController"

export const createOutputIrRouter = {
    'router':'/OutputIr',
    'controller': createOutputIr
}

export const updataOutputIrRouter = {
    'router': '/OutputIr/:id',
    'controller': updateOutputIRGB
}

export const getAllOutputIrRouter = {
    'router': '/OutputIr',
    'controller': getAllOutputIr
}