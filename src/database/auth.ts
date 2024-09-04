import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Definir uma interface para a adição da propriedade user ao objeto de solicitação
interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        username: string;
    };
}

// Função para gerar token JWT
export function generateToken(userId: number, username: string): string {
	const payload = { userId, username };
	const secretKey = 'sua_chave_secreta_aqui'; 
	const options = { expiresIn: '1h' };

	return jwt.sign(payload, secretKey, options);
}

// Middleware de autenticação
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
	const token = req.headers.authorization;

	if (!token) {
		return res.status(401).json({ message: 'Token não fornecido' });
	}

	jwt.verify(token, 'sua_chave_secreta_aqui', (err, decoded) => {
		if (err) {
			return res.status(403).json({ message: 'Token inválido' });
		}

		// Adicione as informações do usuário ao objeto de solicitação para uso posterior
		req.user = decoded as { userId: number; username: string };
		next();
	});
}