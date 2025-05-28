import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// TODO: Add report controller functions
router.get('/purchase', protect, (req, res) => res.json([]));
router.get('/sales', protect, (req, res) => res.json([]));
router.get('/purchase-return', protect, (req, res) => res.json([]));
router.get('/sales-return', protect, (req, res) => res.json([]));

export default router;