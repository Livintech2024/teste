import prisma from "../database";

export const getAllOutputRGB = async (req, res)=>{
    try{

        const allOutputRGB = await prisma.ouputRGB.findMany()
        if(allOutputRGB)
            return res.status(200).json({
                error: false,
                message: 'Success: Saídas Relay encontradas com sucesso !',
                allOutputRGB
            })
    }catch(err){
        console.log(err)
    }
}

export const createOutputRGB = async (req, res)=>{
    try{
        const {irgbModuleId, numOutput, color} = req.body
        const createOuputRGB = await prisma.ouputRGB.create({
            data:{
                irgbModuleId: irgbModuleId, 
                numOutput: numOutput, 
                color: color
            }
        })
        if(createOuputRGB)
            return res.status(201).json({msg: "Saída criada com sucesso!"})
    }catch(err){
        console.log(err)
    }
}