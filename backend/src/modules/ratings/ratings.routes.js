import { Router } from 'express';
import authenticate from '../../middleware/authenticate.js';
import authorize from '../../middleware/authorize.js';
import validate from '../../middleware/validate.js';
import * as RatingsService from './ratings.service.js';
import { createRatingRules, updateRatingRules, getRatingsRules } from './ratings.validators.js';

const router = Router();

// All rating routes require authentication
router.use(authenticate);

// Normal users can submit a rating for a store (only one per store)
router.post('/', authorize('user', 'admin'), createRatingRules, validate, async (req, res, next) => {
  try {
    const { store_id, value } = req.body;
    const userId = req.user.id;
    const rating = await RatingsService.createRating(userId, store_id, value);
    return res.status(201).json({ success: true, message: 'Rating submitted', rating });
  } catch (err) {
    next(err);
  }
});

// User can modify their own rating
router.patch('/', authorize('user', 'admin'), updateRatingRules, validate, async (req, res, next) => {
  try {
    const { rating_id, value } = req.body;
    const userId = req.user.id;
    const rating = await RatingsService.updateRating(userId, rating_id, value);
    return res.status(200).json({ success: true, message: 'Rating updated', rating });
  } catch (err) {
    next(err);
  }
});

// Get current user's ratings
router.get('/user', authorize('user'), async (req, res, next) => {
  try {
    const ratings = await RatingsService.getUserRatings(req.user.id);
    return res.status(200).json({ success: true, ratings });
  } catch (err) {
    next(err);
  }
});

// Store owner can view all ratings for their store
router.get('/store/:storeId', authorize('admin'), getRatingsRules, validate, async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const ratings = await RatingsService.getRatingsByStore(storeId);
    return res.status(200).json({ success: true, ratings });
  } catch (err) {
    next(err);
  }
});

// Get average rating for a store (accessible to all authenticated users)
router.get('/store/:storeId/average', authenticate, async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const avg = await RatingsService.getAverageRating(storeId);
    return res.status(200).json({ success: true, average: avg });
  } catch (err) {
    next(err);
  }
});

// System admin can fetch all ratings
router.get('/', authorize('owner'), async (req, res, next) => {
  try {
    const ratings = await RatingsService.getAllRatings();
    return res.status(200).json({ success: true, ratings });
  } catch (err) {
    next(err);
  }
});


export default router