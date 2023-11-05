import Joi from 'joi';

const register = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().required(),
    username: Joi.string().required(),
});

const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

export default {
    register,
    login,
};
