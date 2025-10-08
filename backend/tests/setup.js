import dotenv from 'dotenv';
dotenv.config({ path: '../.env.test'})
import db from '../src/models/index.js';

beforeAll(async () => {
    try{
        await db.sequelize.sync({ force: true }); // creates clean tables
    }catch(err){
        console.error('Error during DB setup: ', err);
        throw err;
    }
    
});

afterAll(async () => {
    try{
        await db.sequelize.close();
    }catch(err){
        console.error('Error closing DB connection: ', err);
    }
});