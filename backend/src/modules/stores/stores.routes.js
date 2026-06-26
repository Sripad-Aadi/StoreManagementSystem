import { Router } from "express";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";
import * as StoresService from "./stores.service.js";
import { createStoreRules } from "./stores.validators.js";

const router = Router();
router.use(authenticate);

// Get all stores (accessible to any authenticated user)
router.get('/', async (req, res, next) => {
  try {
    const stores = await StoresService.getAllStores(req.query);
    return res.status(200).json({ success: true, stores });
  } catch (err) {
    next(err);
  }
});

router.post("/", createStoreRules, validate, authorize('owner'), async (req, res, next)=>{
    try {
        const { name, email, address, owner_id} = req.body;
        const store = await StoresService.createStore(name, email, address, owner_id);

        return res.status(201).json({
            success: true,
            message: "Store created successfully",
            store: store 
        });
    } catch (err) {
        next(err);
    }
});

export default router;