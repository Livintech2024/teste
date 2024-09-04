import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import dotenv from 'dotenv'
import crypto from 'crypto'
import prisma from "../database"

dotenv.config()

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
})

export default {

    async getImage(req, res) {
        console.log(req.query)
        try {
            if (req.query.type === "space") {
                const posts = await prisma.space.findMany({
                    include: {
                        devicesIR: true,
                        devicesLoad: true,
                    }
                });
    
                console.log(posts);
                /*for (const post of posts) {
                    const getObjectParams = {
                        Bucket: bucketName,
                        Key: post.image
                    };
    
                    const command = new GetObjectCommand(getObjectParams);
                    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
                    post.image = url;
                }*/
    
                res.send(posts);
            } else if (req.query.type === "scene") { // Alterado de req.type.type para req.query.type
                const scene = await prisma.scene.findMany();
    
                console.log(scene);
                for (const post of scene) {
                    const getObjectParams = {
                        Bucket: bucketName,
                        Key: post.sceneImg
                    };
    
                    const command = new GetObjectCommand(getObjectParams);
                    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
                    post.sceneImg = url;
                }
    
                res.send(scene);
            }
        } catch (err) {
            console.log(err);
        }
    },

    async postImage(req, res) {

        const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
        const file = req.file
        const imageName = generateFileName()

        const res1 = await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Body: file.buffer,
            Key: imageName,
            ContentType: file.mimetype
        }))

        res.status(201).json({
            msg: "Imagem enviada com sucesso!",
            res: res1,
            imageName: imageName
        })
    },

    async updateImage(req, res) {

    },

    async deleteImage(req, res) {

    }
}


