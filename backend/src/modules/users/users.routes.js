import {Router} from "express";
import { createUserRules, getUsersRules  } from "./users.validator.js";
import * as UserService from "./users.service.js";
import validate from "../../middleware/validate.js";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js"

const router = Router();

router.use(authenticate);
router.use(authorize('owner'));

router.post("/", createUserRules, validate, async (req, res, next)=>{
    try {
        const { name, email, password, address, role} = req.body;

        const user = await UserService.createUser(name, email, password, address, role);

        return res.status(201).json({
            success: true,
            message: "User Created Successfully",
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

router.get("/", getUsersRules, validate, async (req, res, next)=>{
    try {
        const users = await UserService.getUsersService(req.query);
        return res.status(200).json({
            success: true,
            message: "User detailes fetched Successfully",
            user: users,
        });
    } catch (err) {
        next(err);
    }
});

export default router;