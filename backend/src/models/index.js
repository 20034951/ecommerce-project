import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

import ProductModel from './product.js';
import CategoryModel from './category.js';
import UserModel from './user.js';

const Product = ProductModel(sequelize, DataTypes);
const Category = CategoryModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

//Export 
const db = {
    sequelize,
    Product,
    Category,
    User
};

export default db;