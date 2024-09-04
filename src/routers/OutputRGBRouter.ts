import { getAllOutputRGB, createOutputRGB } from "../controllers/OutputRGBController";

export const createOutputRGBRouter = {
    'router': '/outputRGB',
    'controller': createOutputRGB
}

export const getAllOutputRGBRouter = {
    'router': '/outputRGB',
    'controller': getAllOutputRGB
}