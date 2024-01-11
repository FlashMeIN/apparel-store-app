import express from 'express';
import { checkFulfillment, getLowestCost, updateApparel, updateMultipleApparels } from '../controllers/apparelController';
import { authorize } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/vendor/update', authorize('vendor'), updateApparel);
router.post('/vendor/update-multiple', authorize('vendor'), updateMultipleApparels);
router.post('/user/check-fulfillment', authorize('user'), checkFulfillment);
router.post('/user/get-lowest-cost', authorize('user'), getLowestCost);

export default router;
