import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middlewares/error.middleware';
import helmet from 'helmet';

class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initializeDatabaseConnetion();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    private initializeMiddlewares(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router);
        });
    }

    private initializeErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    private initializeDatabaseConnetion(): void {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
        mongoose
            .connect(
                `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`,
                //'mongodb+srv://ermander:4IbmSceYO7rWjAgh@cluster0.udps4ct.mongodb.net/',
            )
            .then(() => {
                console.log('Database connected');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App listening on url http://localhost:${this.port}`);
        });
    }
}

export default App;
