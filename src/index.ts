import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';

// Controllers
import PostController from '@/controllers/post.controller';
import UserController from '@/controllers/user.controller';

validateEnv();

const app = new App(
    [new PostController(), new UserController()],
    Number(process.env.PORT),
);

app.listen();
