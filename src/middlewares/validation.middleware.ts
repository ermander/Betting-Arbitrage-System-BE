import { Request, Response, NextFunction, RequestHandler } from 'express';
import joi from 'joi';

function validationMiddleware(schema: joi.Schema): RequestHandler {
    return async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };

        try {
            const value = await schema.validateAsync(
                req.body,
                validationOptions,
            );
            req.body = value;
            next();
        } catch (e: any) {
            const errors: string[] = [];
            e.details.forEach((err: joi.ValidationErrorItem) => {
                errors.push(err.message);
            });
            res.status(400).send({ errors });
        }
    };
}

export default validationMiddleware;
