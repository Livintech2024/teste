import prisma from '../database';
import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv'

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
	async createScene(request: Request, response: Response) {
		try {

			let tokenUserId: number;
			const userToken = request.headers['authorization'];


			jwt.verify(userToken, 'secret_key', (erro, decoded) => {
				if (erro) console.error('Erro ao verificar o JWT:', erro.message);// Tratar o erro, por exemplo, token expirado, assinatura inválida, etc.

				// As informações do JWT estão no objeto "decoded"
				// Acessando id do usuário
				tokenUserId = decoded.id;
			});

			const { sceneName, createdAt, spaceId, updatedAt, sceneImg, devices } = request.body;
			const sceneExist = await prisma.scene.findMany({
				where: {
					sceneName: sceneName
				}
			});

			if (sceneExist.some(item=>item.userId === tokenUserId)) {
				return response.json({
					error: true,
					message: 'Error: Cenário já existente dentro do usuário !'
				});
			}

			const date = new Date()
			const createScene = await prisma.scene.create({
				data: {
					userId: tokenUserId,
					sceneName: sceneName,
					spaceId: spaceId,
					sceneImg: sceneImg,
					createdAt: date,
					updatedAt: date,
					devices: devices
				}
			})

			return response.json({
				error: false,
				message: 'Success: Cenário criado com sucesso !',
				createScene
			});
		} catch (error) {
			return response.json({ message: error.message });
		}

	},

	async deleteScene(request: Request, response: Response) {
		try {
			const { id } = request.params;
			const sceneExist = await prisma.scene.findUnique({
				where: {
					id: Number(id)
				}
			});

			if (!sceneExist) {
				return response.json({
					error: true,
					message: 'Error: Cenário não existe !'
				});
			}

			const scene = await prisma.scene.delete({
				where: {
					id: Number(id)
				}
			});

			return response.json({
				error: false,
				message: 'Success: Cenário deletado com sucesso !',
				scene
			});
		} catch (error) {
			return response.json({ message: error.message });
		}

	},
	async findScene(request: Request, response: Response) {
		try {
			const { id } = request.params;
			const scene = await prisma.scene.findUnique({
				where: {
					id: Number(id)
				},
				include: {
					devices: true
				}
			});

			if (!scene) {
				return response.json({
					error: true,
					message: 'Error: Cenário não existe !'
				});
			}
			return response.json({
				error: false,
				message: 'Success: Cenário encontrado com sucesso !',
				scene
			});
		} catch (error) {
			return response.json({ message: error.message });
		}
	},
	async findAllScenes(request: Request, response: Response) {
		try {
			const scenes = await prisma.scene.findMany({
				include: {
					devices: true
				}
			});

			for (const post of scenes) {
				const getObjectParams = {
					Bucket: bucketName,
					Key: post.sceneImg
				};

				const command = new GetObjectCommand(getObjectParams);
				const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
				post.sceneImg = url;
			}

			return response.json({
				error: false,
				message: `Success: ${scenes.length} Cenários encontrados com sucesso !`,
				scenes
			});
		} catch (error) {
			return response.json({ message: error.message });
		}

	},
	async findAllUserScenes(request: Request, response: Response) {
		try {
			let userId;
			const userToken = request.headers['authorization'];


			jwt.verify(userToken, 'secret_key', (erro, decoded) => {
				if (erro) console.error('Erro ao verificar o JWT:', erro.message);// Tratar o erro, por exemplo, token expirado, assinatura inválida, etc.

				// As informações do JWT estão no objeto "decoded"
				// Acessando id do usuário
				userId = decoded.id;
				console.log(userId);
			});

			const scenes = await prisma.scene.findMany({
				include: {
					devices: true
				},
				where:{
					userId: userId
				}
			});

			for (const post of scenes) {
				const getObjectParams = {
					Bucket: bucketName,
					Key: post.sceneImg
				};

				const command = new GetObjectCommand(getObjectParams);
				const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
				post.sceneImg = url;
			}

			return response.json({
				error: false,
				message: `Success: ${scenes.length} Cenários encontrados com sucesso !`,
				scenes
			});
		} catch (error) {
			return response.json({ message: error.message });
		}

	},
	async updateScene(request: Request, response: Response) {
		try {
			const { id, sceneName, spaceId, sceneImg } = request.body;

			const sceneExist = await prisma.scene.findUnique({
				where: {
					id: Number(id)
				}
			});

			if (!sceneExist) {
				return response.json({
					error: true,
					message: 'Error: Cenário não existe !'
				});
			}

			const scene = await prisma.scene.update({
				where: {
					id: Number(id)
				},
				data: {
					sceneName: sceneName,
					spaceId: spaceId,
					sceneImg: sceneImg
				}
			});
			return response.json({
				error: false,
				message: 'Success: Cenários encontrados com sucesso !',
				scene
			});

		} catch (error) {
			return response.json({ message: error.message });
		}


	}
};