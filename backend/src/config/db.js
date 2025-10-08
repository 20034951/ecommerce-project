import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize(
    isTest ? process.env.MYSQL_DATABASE_TEST : process.env.MYSQL_DATABASE,
    isTest ? process.env.MYSQL_USER_TEST : process.env.MYSQL_USER,
    isTest ? process.env.MYSQL_PASSWORD_TEST : process.env.MYSQL_PASSWORD, {
        host: isTest ? process.env.MYSQL_HOST_TEST || '127.0.0.1' : 'mysql',
        port: isTest ? parseInt(process.env.MYSQL_PORT_TEST) || 3307 : 3306,
        dialect: 'mysql',
        logging: false
});

export default sequelize;