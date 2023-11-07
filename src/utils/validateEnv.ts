import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production', 'test'],
            default: 'development',
        }),
        PORT: port({ default: 3000 }),
        MONGO_PATH: str(),
        MONGO_USER: str(),
        MONGO_PASSWORD: str(),
        JWT_SECRET: str(),
        TELEGRAM_TOKEN: str(),
        TELEGRAM_CHAT_ID: str(),
    });
}

export default validateEnv;
