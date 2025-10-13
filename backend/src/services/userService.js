import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import HttpError from '../utils/HttpError.js';

const { User, UserSession } = db;

export const getAllUsers = async () => {
    return await User.findAll({
        attributes: { exclude: ['password_hash'] },
        order: [['created_at', 'DESC']]
    });
};

export const getUserById = async (id) => {
    const user = await User.findByPk(id, {
        attributes: { exclude: ['password_hash'] }
    });
    if(!user) throw new HttpError(404, 'User not found');
    return user;
};

export const createUser = async (data) => {
    const { name, email, password, phone, role = 'customer', isActive = true } = data;

    if(!name || !email || !password){
        throw new HttpError(400, 'Name, email and password are required');
    }

    // Verificar si el email ya existe
    const existing = await User.findOne({ where: { email }});
    if (existing) throw new HttpError(400, 'Email already exists');

    // Hash de la contraseña
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({ 
        name, 
        email, 
        password_hash, 
        phone, 
        role, 
        isActive 
    });

    return await getUserById(user.user_id);
};

export const updateUser = async (id, data) => {
    const { name, email, password, phone, role, isActive } = data;
    const user = await User.findByPk(id);
    if(!user) throw new HttpError(404, 'User not found');

    if(name !== undefined) user.name = name;
    if(email !== undefined) {
        // Verificar que el email no esté en uso por otro usuario
        const existing = await User.findOne({ 
            where: { 
                email, 
                user_id: { [Op.ne]: id } 
            }
        });
        if (existing) throw new HttpError(400, 'Email already exists');
        user.email = email;
    }
    if(password !== undefined) {
        const saltRounds = 12;
        user.password_hash = await bcrypt.hash(password, saltRounds);
    }
    if(phone !== undefined) user.phone = phone;
    if(role !== undefined) user.role = role;
    if(isActive !== undefined) user.isActive = isActive;

    await user.save();

    return await getUserById(user.user_id);
};

export const deleteUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) throw new HttpError(404, 'User not found');

    await user.destroy();
    return { message: 'User deleted successfully' };
};

export const getUserSessions = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) throw new HttpError(404, 'User not found');

    const sessions = await UserSession.findAll({
        where: { 
            user_id: userId,
            is_active: true
        },
        attributes: ['session_id', 'device_info', 'ip_address', 'last_activity', 'created_at'],
        order: [['last_activity', 'DESC']]
    });

    return sessions;
};

export const terminateUserSession = async (userId, sessionId) => {
    const user = await User.findByPk(userId);
    if (!user) throw new HttpError(404, 'User not found');

    const session = await UserSession.findOne({
        where: { 
            session_id: sessionId,
            user_id: userId,
            is_active: true
        }
    });

    if (!session) throw new HttpError(404, 'Session not found');

    await session.update({ is_active: false });
    return { message: 'Session terminated successfully' };
};

export const terminateAllUserSessions = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) throw new HttpError(404, 'User not found');

    const result = await UserSession.update(
        { is_active: false },
        { 
            where: { 
                user_id: userId,
                is_active: true
            }
        }
    );

    return { 
        message: 'All sessions terminated successfully',
        sessionsTerminated: result[0]
    };
};