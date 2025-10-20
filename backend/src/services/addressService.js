import db from '../models/index.js';
import HttpError from '../utils/HttpError.js';

const { UserAddress } = db;

/**
 * Obtener todas las direcciones de un usuario
 */
export const getUserAddresses = async (userId, type = null) => {
    const where = { user_id: userId };
    
    if (type && ['shipping', 'billing'].includes(type)) {
        where.type = type;
    }

    const addresses = await UserAddress.findAll({
        where,
        order: [['address_id', 'DESC']]
    });

    return addresses;
};

/**
 * Obtener una dirección específica por ID
 */
export const getAddressById = async (addressId, userId) => {
    const address = await UserAddress.findOne({
        where: {
            address_id: addressId,
            user_id: userId
        }
    });

    if (!address) {
        throw new HttpError(404, 'Dirección no encontrada');
    }

    return address;
};

/**
 * Crear una nueva dirección
 */
export const createAddress = async (addressData, userId) => {
    const { address_line, city, state, country, postal_code, type } = addressData;

    // Validaciones
    if (!address_line || !city || !country) {
        throw new HttpError(400, 'Dirección, ciudad y país son requeridos');
    }

    if (type && !['shipping', 'billing'].includes(type)) {
        throw new HttpError(400, 'El tipo debe ser "shipping" o "billing"');
    }

    const newAddress = await UserAddress.create({
        user_id: userId,
        address_line,
        city,
        state,
        country,
        postal_code,
        type: type || 'shipping'
    });

    return newAddress;
};

/**
 * Actualizar una dirección existente
 */
export const updateAddress = async (addressId, addressData, userId) => {
    const address = await getAddressById(addressId, userId);

    const { address_line, city, state, country, postal_code, type } = addressData;

    // Validar tipo si se proporciona
    if (type && !['shipping', 'billing'].includes(type)) {
        throw new HttpError(400, 'El tipo debe ser "shipping" o "billing"');
    }

    // Actualizar solo los campos proporcionados
    const updateFields = {};
    if (address_line !== undefined) updateFields.address_line = address_line;
    if (city !== undefined) updateFields.city = city;
    if (state !== undefined) updateFields.state = state;
    if (country !== undefined) updateFields.country = country;
    if (postal_code !== undefined) updateFields.postal_code = postal_code;
    if (type !== undefined) updateFields.type = type;

    await address.update(updateFields);

    return address;
};

/**
 * Eliminar una dirección
 */
export const deleteAddress = async (addressId, userId) => {
    const address = await getAddressById(addressId, userId);

    // Verificar que la dirección no esté siendo usada en órdenes activas
    const { Order } = db;
    const activeOrders = await Order.count({
        where: {
            address_id: addressId,
            status: ['pending', 'paid', 'processing', 'shipped']
        }
    });

    if (activeOrders > 0) {
        throw new HttpError(400, 'No se puede eliminar una dirección asociada a pedidos activos');
    }

    await address.destroy();

    return { message: 'Dirección eliminada exitosamente' };
};

export default {
    getUserAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress
};
