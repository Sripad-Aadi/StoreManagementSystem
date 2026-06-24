import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import createTables from './config/schema.js'
import seed from './config/seed.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
await createTables()
await seed()

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


app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
});
