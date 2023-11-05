import UserModel from '@/models/user.model';
import token from '@/utils/token';

class UserService {
    private user = UserModel;

    /**
     * Register a new user
     */
    public async register(
        name: string,
        email: string,
        username: string,
        password: string,
        role: string,
    ): Promise<string | Error> {
        try {
            const user = await this.user.create({
                name,
                email,
                username,
                password,
                role,
            });

            const accessToken = token.createToken(user);

            return accessToken;
        } catch (error: any) {
            throw new Error('Unable to register user');
        }
    }

    public async login(
        email: string,
        password: string,
    ): Promise<string | Error> {
        try {
            const user = await this.user.findOne({ email });

            if (!user) throw new Error('User not found');

            const isValidPassword = await user.isValidPassword(password);

            if (!isValidPassword) throw new Error('Invalid password');

            const accessToken = token.createToken(user);

            return accessToken;
        } catch (error: any) {
            throw new Error('Unable to login user');
        }
    }
}

export default UserService;
