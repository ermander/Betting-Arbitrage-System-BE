import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/token';
import UserModel from '@/models/user.model';
import Token from '@/utils/interfaces/token.interface';
import HttpException from '@/utils/exceptions/http.exception';
import jwt from 'jsonwebtoken';

async function authenticated(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }

    const accessToken = bearer.split('Bearer ')[1].trim();

    try {
        const payload: Token | jwt.JwtPayload = await verifyToken(accessToken);

        if (payload instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        const user = await UserModel.findById(payload.id)
            .select('-password')
            .exec();

        if (!user) {
            return next(new HttpException(401, 'Unauthorized'));
        }

        req.user = user;

        return next();
    } catch (error: any) {
        next(new HttpException(401, error.message));
    }
}

export default authenticated;
