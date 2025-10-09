import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

import ProductModel from './product.js';
import CategoryModel from './category.js';
import UserModel from './user.js';
import RoleModel from './role.js';
import UserRoleModel from './userRole.js';

const Product = ProductModel(sequelize, DataTypes);
const Category = CategoryModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
const Role = RoleModel(sequelize, DataTypes);
const UserRole = UserRoleModel(sequelize, DataTypes);

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

if(User.associate) User.associate( { Role, UserRole });
if(Role.associate) Role.associate( { User, UserRole });

//Export 
const db = {
    sequelize,
    Product,
    Category,
    User,
    Role,
    UserRole
};

export default db;