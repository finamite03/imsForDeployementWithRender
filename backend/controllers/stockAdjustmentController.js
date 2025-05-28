import StockAdjustment from '../models/stockAdjustmentModel.js';
import SKU from '../models/skuModel.js';
import asyncHandler from 'express-async-handler';

// Create stock adjustment
export const createStockAdjustment = asyncHandler(async (req, res) => {
  const { sku, warehouse, adjustmentType, quantity, reason } = req.body;
  const adjustment = await StockAdjustment.create({
    sku,
    warehouse,
    adjustmentType,
    quantity,
    reason,
    user: req.user._id,
  });

  // Update SKU stock
  const skuDoc = await SKU.findById(sku);
  if (!skuDoc) throw new Error('SKU not found');
  skuDoc.currentStock += adjustmentType === 'increase' ? quantity : -quantity;
  await skuDoc.save();

  res.status(201).json(adjustment);
});

// Get all adjustments
export const getStockAdjustments = asyncHandler(async (req, res) => {
  const adjustments = await StockAdjustment.find().populate('sku warehouse user');
  res.json(adjustments);
});