import prisma from "../database";
import { Request, Response } from "express";

export const getAllOutputRelay = async (req, res) => {
    try {
        const allOutputRelay = await prisma.outputRelay.findMany()
        if (allOutputRelay)
            return res.status(200).json({
                error: false,
                message: 'Success: Saídas Relay encontradas com sucesso !',
                allOutputRelay
            })

    } catch (err) {
        console.log(err)
    }
}

export const createOutputRelay = async (req, res) => {
    const { relayModuleId, outputFunction, outputType, numOutput, timeOn, createdAt, updatedAt, outputState } = req.body

    const createOutputRelay = await prisma.outputRelay.create({
        data: {
            relayModuleId: relayModuleId,
            outputFunction: outputFunction,
            outputType: outputType,
            numOutput: numOutput,
            timeOn: timeOn,
            createdAt: createdAt,
            updatedAt: updatedAt,
            outputState: outputState
        }
    })

    if (createOutputRelay)
        return res.status(201).json({ msg: "Saída criada com sucesso!" })
}

export const updateOutputRelay = async (req: Request, res: Response) => {
    try {
        const { outputState, outputFunction } = req.body
        const outputId = req.params.id

        const outputExists = await prisma.outputRelay.findUnique({
            where: { id: Number(outputId) }
        });
        if (!outputExists) {
            return res.json({
                error: true,
                message: 'Error: Saída não existe !'
            });
        }

        const updateOutputRelay = await prisma.outputRelay.update({
            where: { id: Number(outputId) },
            data: {
                outputFunction: outputFunction,
                outputState: Boolean(outputState),
            }
        });

        return res.json({
            error: false,
            message: 'Success: Saída atualizada com sucesso !',
            updateOutputRelay
        });
    } catch (error) {
        return res.json({ error: error.message })
    }
}

export const deleteOutputRelay = async (req, res) => {

}