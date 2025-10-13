import db from '../models/index.js';
import HttpError from '../utils/HttpError.js';

const { User, Role } = db;

export const getAllUsers = async () => {
    return await User.findAll({
        include: [{ model: Role, through: { attributes: [] } }]
    });
};

export const getUserById = async (id) => {
    const user = await User.findByPk(id, {
        include: [ { model: Role, through: { attributes: [] } }]
    });
    if(!user) throw new HttpError(404, 'User not found');
    return user;
};

export const createUser = async (data) => {
    const { name, username, email, password, isActive, roles = [] } = data;

    if(!name || !username || !email || !password){
        throw new HttpError(400, 'Missing required fields');
    }

    const existing = await User.findOne({ where: { username }});
    if (existing) throw new HttpError(400, 'Username already exists');

    const user = await User.create( {name, username, email, password, isActive } );

    if (roles.length > 0){
        const foundRoles = await Role.findAll( { where: { id: roles } });
        await user.setRoles(foundRoles);
    }

    return await getUserById(user.id);
};

export const updateUser = async (id, data) => {
    const { name, username, email, password, isActive, roles } = data;
    const user = await User.findByPk(id);
    if(!user) throw new HttpError(404, 'User not found');

    if(name !== undefined) user.name = name;
    if(username !== undefined) user.username = username;
    if(email !== undefined) user.email = email;
    if(password !== undefined) user.password = password;
    if(isActive !== undefined) user.isActive = isActive;

    await user.save();

    if(roles && Array.isArray(roles)) {
        const foundRoles = await Role.findAll( { where: { id: roles } });
        await user.setRoles(foundRoles);
    }

    return await getUserById(user.id);
}

export const deleteUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) throw new HttpError(404, 'User not found');

    await user.destroy();
    return { message: 'User deleted successfully' };
};