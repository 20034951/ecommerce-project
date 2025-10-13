import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

import ProductModel from './product.js';
import CategoryModel from './category.js';
import UserModel from './user.js';
import RoleModel from './role.js';
import UserRoleModel from './userRole.js';
import RefreshTokenModel from './refreshToken.js';

const Product = ProductModel(sequelize, DataTypes);
const Category = CategoryModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
const Role = RoleModel(sequelize, DataTypes);
const UserRole = UserRoleModel(sequelize, DataTypes);
const RefreshToken = RefreshTokenModel(sequelize, DataTypes);

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

if(User.associate) User.associate({ Role, UserRole });
if(Role.associate) Role.associate({ User, UserRole });
if(RefreshToken.associate) RefreshToken.associate({ User });

const syncDatabase = async (force = false) => {
    console.log('[DEBUG][DB] Starting database sync. Force:', force);
    try {
        await sequelize.sync({ force });
        console.log('[DEBUG][DB] Database synchronized successfully');
    } catch (err) {
        console.error('[ERROR][DB] Database sync failed:', err);
        throw err;
    }
};

const db = {
    sequelize,
    Product,
    Category,
    User,
    Role,
    UserRole,
    RefreshToken,
    syncDatabase
};

export default db;