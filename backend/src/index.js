import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import createTables from './config/schema.js'
import seed from './config/seed.js';
import errorHandler from './middleware/errorHandler.js';
import authRouter from './modules/auth/auth.routes.js';

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(cors({ 
    origin: FRONTEND_URL, 
    credentials: true 
}));

app.use(express.json());

app.get('/api/health',(req, res)=>{
    return res.status(200).json({
        success: true, 
        message: 'server running',
    });
});

app.use('/api/auth',authRouter);

app.use(errorHandler);

async function startServer() {
    try {
        await createTables();
        await seed();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();