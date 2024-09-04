import prisma from "../database";
import { Response, Request } from "express"


export const getAllOutputIr = async (req: Request, res: Response) => {
    try {
        const outputIr = await prisma.outputIR.findMany()
        if (outputIr)
            return res.status(200).json({
                error: false,
                message: 'Success: Saídas IR encontradas com sucesso !',
                outputIr
            })
    } catch (err) {
        console.log(err)
    }
}

export const createOutputIr = async (req: Request, res: Response) => {
    try {
        const { irgbModuleId, outputType, numOutput } = req.body;

        const createOutputIr = await prisma.outputIR.create({
            data: {
                irgbModuleId: irgbModuleId,
                outputType: outputType,
                numOutput: numOutput
            }
        })

        if (createOutputIr)
            return res.status(201).json({ msg: "Saída criada com sucesso!" })
    } catch (err) {
        console.log(err)
    }
}

export const updateOutputIRGB = async (req: Request, res: Response) => {
    try {
        const { outputState } = req.body
        const outputId = req.params.id

        const outputExists = await prisma.outputIR.findUnique({
            where: { id: Number(outputId) }
        });
        if (!outputExists) {
            return res.json({
                error: true,
                message: 'Error: Saída não existe !'
            });
        }

        const updateOutputIR = await prisma.outputIR.update({
            where: { id: Number(outputId) },
            data: {
                outputState: Boolean(outputState),
            }
        });

        return res.json({
            error: false,
            message: 'Success: Saída atualizada com sucesso !',
            updateOutputIRGB
        });
    } catch (error) {
        return res.json({ error: error.message })
    }
}

