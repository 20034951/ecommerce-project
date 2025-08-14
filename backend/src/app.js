import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Backend running' });
});

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Backend running on port ${process.env.PORT}`);
});