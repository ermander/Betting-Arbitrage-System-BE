import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middlewares/validation.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';
import authenticated from '@/middlewares/authenticated.middleware';

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register,
        );
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login,
        );
        this.router.get(`${this.path}/me`, authenticated, this.me);
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { name, email, username, password } = req.body;

            const token = await this.UserService.register(
                name,
                email,
                username,
                password,
                'USER_ROLE',
            );

            return res.status(201).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;

            const token = await this.UserService.login(email, password);

            return res.status(200).json({ token });
        } catch (error: any) {
            next(new HttpException(500, error.message));
        }
    };

    private me = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            if (!req.user) {
                return next(new HttpException(404, 'No logged in user'));
            }

            res.status(200).json({ user: req.user });
        } catch (error: any) {
            next(new HttpException(500, error.message));
        }
    };
}

export default UserController;
