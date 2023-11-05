import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import User from '@/resources/user/user.interface';

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, 'The email is required'],
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: [true, 'The name is required'],
            trim: true,
        },
        username: {
            type: String,
            required: [true, 'The username is required'],
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'The password is required'],
            trim: true,
        },
        role: {
            type: String,
            default: 'USER_ROLE',
            enum: ['USER_ROLE', 'ADMIN_ROLE'],
        },
    },
    {
        timestamps: true,
    },
);

UserSchema.pre<User>('save', async function (next) {
    if (!this.isModified('password')) return next();

    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;

    next();
});

UserSchema.methods.isValidPassword = async function (
    password: string,
): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password).catch((error) => {
        throw error;
    });
};

export default model<User>('User', UserSchema);
