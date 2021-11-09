import express from 'express';
import {
	createProduct,
	createProductReview,
	deleteProduct,
	getProductById,
	getProducts,
	updateProduct,
} from '../controllers/productController.js';
import { isAdmin, protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').get(getProducts).post(protect, isAdmin, createProduct);
router
	.route('/:id')
	.get(getProductById)
	.delete(protect, isAdmin, deleteProduct)
	.put(protect, isAdmin, updateProduct);

router.route('/:id/review').post(protect, createProductReview);

export default router;
