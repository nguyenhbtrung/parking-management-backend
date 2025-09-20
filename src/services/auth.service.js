import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { Op } from 'sequelize';
import { generateToken } from '../utils/auth.js';
import { AppError, InvalidCredentialsError } from '../errors/index.js';

export const registerAsync = async ({ username, password, email, phone }) => {
    const existingUser = await User.findOne({
        where: {
            [Op.or]: [{ email }, { username }]
        }
    });

    if (existingUser) {
        const duplicatedField = existingUser.username === username ? 'username' : 'email';
        throw new AppError(
            `${duplicatedField} already exists`,
            duplicatedField === 'email' ? 'DUPLICATE_EMAIL' : 'DUPLICATE_USERNAME',
            409,
            { [duplicatedField]: `${duplicatedField} already exists` }
        );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        username,
        passwordHash,
        email,
        phone,
        role: 'user'
    });
    const user = {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
    };
    const token = generateToken(user);
    return { user, token };
};

export const loginAsync = async ({ username, password }) => {
    const existingUser = await User.findOne({ where: { username } });
    if (!existingUser)
        throw new InvalidCredentialsError();

    const isValidPassword = await bcrypt.compare(password, existingUser.passwordHash);
    if (!isValidPassword)
        throw new InvalidCredentialsError();

    const user = {
        id: existingUser.id,
        username: existingUser.username,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        role: existingUser.role,
    };
    const token = generateToken(user);
    return { user, token };
};
