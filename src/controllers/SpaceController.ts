import { Response, Request } from 'express';
import prisma from '../database';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import jwt from 'jsonwebtoken';
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
	async createSpace(request: Request, response: Response) {
		let userId;
		const userToken = request.headers['authorization'];
		console.log("Header da requisição: ", request.headers['authorization'])

		jwt.verify(userToken, 'secret_key',(error, decoded)=>{
			if (error) console.error('Erro ao verificar o JWT:', error.message);// Tratar o erro, por exemplo, token expirado, assinatura inválida, etc.

			// As informações do JWT estão no objeto "decoded"
			// Acessando id do usuário
			userId = decoded.id;
			console.log(userId);
		})
		try {
			const { spaceName, image } = request.body;
			const spaceExist = await prisma.space.findMany({
				where: {
					spaceName: spaceName
				}
			});

			if (spaceExist.some(item => item.userId === userId)) {
				return response.json({
					error: true,
					message: 'Error: Espaço já existente dentro desse usuário!'
				});
			}

			const space = await prisma.space.create({
				data: {
					userId: userId,
					spaceName: spaceName,
					image: image
				}
			});

			return response.json({
				error: false,
				message: 'Success: Espaço criado com sucesso !',
				space
			});
		} catch (error) {
			return response.json({ message: error.message });
		}
	},

	async deleteSpace(request: Request, response: Response) {
		try {
			const { id } = request.params;
			const spaceExist = await prisma.space.findUnique({
				where: {
					id: Number(id)
				}
			});

			if (!spaceExist) {
				return response.json({
					error: true,
					message: 'Error: Espaço não existe !'
				});
			}

			const space = await prisma.space.delete({
				where: {
					id: Number(id)
				},
			});
			return response.json({
				error: false,
				message: 'Success: Espaço deletado com sucesso !',
				space
			});

		} catch (error) {
			return response.json({ message: error.message });
		}
	},

	async updateSpace(request: Request, response: Response) {
		try {
			const { id, spaceName, image } = request.body;
			const spaceExist = await prisma.space.findUnique({
				where: {
					id: Number(id)
				}
			});

			if (!spaceExist) {
				return response.json({
					error: true,
					message: 'Error: Espaço não existe !'
				});
			}

			const space = await prisma.space.update({
				where: {
					id: Number(id)
				},
				data: {
					image: image,
					spaceName: spaceName,
				}
			});
			return response.json({
				error: false,
				message: 'Success: Espaço atualizado com sucesso !',
				space
			});

		} catch (error) {
			return response.json({ message: error.message });
		}
	},

	async findSpace(request: Request, response: Response) {
		try {
			const { id } = request.params;
			const space = await prisma.space.findUnique({
				where: {
					id: Number(id)
				}
			});

			if (!space) {
				return response.json({
					error: true,
					message: 'Error: Espaço não existe !'
				});
			}

			return response.json({
				error: false,
				message: 'Success: Espaço encontrado com sucesso !',
				space
			});

		} catch (error) {
			return response.json({ message: error.message });
		}
	},

	async findAllSpaces(request: Request, response: Response) {
		let userId;
		const userToken = request.headers['authorization'];


		jwt.verify(userToken, 'secret_key', (erro, decoded) => {
			if (erro) console.error('Erro ao verificar o JWT:', erro.message);// Tratar o erro, por exemplo, token expirado, assinatura inválida, etc.

			// As informações do JWT estão no objeto "decoded"
			// Acessando id do usuário
			userId = decoded.id;
			console.log(userId);
		});
		
		try {
			const spaces = await prisma.space.findMany({
				where:{
					userId: userId
				},
				include: {
					devicesIR: true,
					devicesLoad: true,
				}
			});

			for (const post of spaces) {
				const getObjectParams = {
					Bucket: bucketName,
					Key: post.image
				};

				const command = new GetObjectCommand(getObjectParams);
				const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
				post.image = url;
			}

			return response.json({
				error: false,
				message: `Success: ${spaces.length} Espaços encontrados com sucesso !`,
				spaces
			});
		} catch (error) {
			return response.json({ message: error.message });
		}
	}
};