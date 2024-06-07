import cors from 'cors';
import express from 'express';
import actionRoutes from './routes/actionRoutes';

export const corsOptions = {
    origin: ['http://localhost:4200', 'http://localhost:4201'],
    methods: ['GET', 'POST'],
};

const app = express();
app.use(cors(corsOptions));

app.use(express.json());
app.use('/api', actionRoutes);

export default app;
