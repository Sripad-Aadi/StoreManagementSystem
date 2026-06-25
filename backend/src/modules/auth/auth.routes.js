import {Router} from 'express';
import { registerRules, passwordRules } from './auth.validators.js'
import validate from '../../middleware/validate.js'
import { register } from './auth.service.js';

const router = Router();

router.post('/register', registerRules, validate,async (req, res, next)=>{
    try {
        const {name, email, password, address} = req.body;

        const user = await register(name, email, password, address);

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role:user.role,
                created_at: user.created_at,
            },
        });
    } catch (err) {
        next(err);
    }
});


export default router