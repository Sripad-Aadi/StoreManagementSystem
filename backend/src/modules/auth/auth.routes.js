import {Router} from 'express';
import { registerRules, passwordRules, loginRules } from './auth.validators.js'
import validate from '../../middleware/validate.js'
import * as AuthService from './auth.service.js';

const router = Router();

router.post('/register', registerRules, validate,async (req, res, next)=>{
    try {
        const {name, email, password, address} = req.body;

        const user = await AuthService.register(name, email, password, address);

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

router.post('/login', loginRules, validate, async (req, res, next)=>{
    try {
        const { email, password} = req.body;

        const {accessToken, user} = await AuthService.login(email, password);

        res.status(200).json({ 
            success: true,
            message: "Login successful",
            data: {
                accessToken, 
                user
            }, 
        });

    } catch (err) {
        next(err);
    }
});

export default router