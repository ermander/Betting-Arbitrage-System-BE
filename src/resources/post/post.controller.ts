import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middlewares/validation.middleware';
import validate from '@/resources/post/post.validation';
import PostService from '@/resources/post/post.service';

class PostController implements Controller {
    public path = '/posts';
    public router = Router();
    public PostService = new PostService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}`,
            validationMiddleware(validate.create),
            this.create,
        );
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            // const { title, body } = req.body;

            // const post = await this.PostService.create(title, body);
            console.log('Entro');

            //return res.status(201).json({ post });
            res.status(201).json({ message: 'Entro' });
        } catch (error: any) {
            next(new HttpException(400, 'Cannot create post'));
        }
    };
}

export default PostController;
