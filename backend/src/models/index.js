import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

// Importar todos los modelos
import ProductModel from './product.js';
import CategoryModel from './category.js';
import UserModel from './user.js';
import UserAddressModel from './userAddress.js';
import ProductTagModel from './productTag.js';
import CartModel from './cart.js';
import CartItemModel from './cartItem.js';
import ShippingMethodModel from './shippingMethod.js';
import NotificationModel from './notification.js';
import ReviewModel from './review.js';
import CouponModel from './coupon.js';
import OrderModel from './order.js';
import OrderItemModel from './orderItem.js';
import UserSessionModel from './userSession.js';
import PasswordResetTokenModel from './passwordResetToken.js';

// Inicializar modelos
const Product = ProductModel(sequelize, DataTypes);
const Category = CategoryModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
const UserAddress = UserAddressModel(sequelize, DataTypes);
const ProductTag = ProductTagModel(sequelize, DataTypes);
const Cart = CartModel(sequelize, DataTypes);
const CartItem = CartItemModel(sequelize, DataTypes);
const ShippingMethod = ShippingMethodModel(sequelize, DataTypes);
const Notification = NotificationModel(sequelize, DataTypes);
const Review = ReviewModel(sequelize, DataTypes);
const Coupon = CouponModel(sequelize, DataTypes);
const Order = OrderModel(sequelize, DataTypes);
const OrderItem = OrderItemModel(sequelize, DataTypes);
const UserSession = UserSessionModel(sequelize, DataTypes);
const PasswordResetToken = PasswordResetTokenModel(sequelize, DataTypes);

// Configurar asociaciones
const models = {
    Product,
    Category,
    User,
    UserAddress,
    ProductTag,
    Cart,
    CartItem,
    ShippingMethod,
    Notification,
    Review,
    Coupon,
    Order,
    OrderItem,
    UserSession,
    PasswordResetToken
};

// Ejecutar asociaciones
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

// Export 
const db = {
    sequelize,
    ...models
};

export default db;