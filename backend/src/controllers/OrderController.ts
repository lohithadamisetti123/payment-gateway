import { Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Order } from '../models/Order';
import { AuthedRequest } from '../middleware/auth';
import { badRequest, notFound } from '../services/errorResponse';
import { generateOrderId } from '../services/idGenerator';

export async function createOrder(req: AuthedRequest, res: Response) {
  const merchant = req.merchant!;
  const { amount, currency = 'INR', receipt, notes } = req.body || {};

  if (!Number.isInteger(amount) || amount < 100) {
    return badRequest(res, 'amount must be at least 100');
  }

  const repo = AppDataSource.getRepository(Order);

  let id: string;
  while (true) {
    id = generateOrderId();
    const existing = await repo.findOne({ where: { id } });
    if (!existing) break;
  }

  const order = repo.create({
    id,
    merchant_id: merchant.id,
    amount,
    currency,
    receipt: receipt || null,
    notes: notes || null,
    status: 'created'
  });

  await repo.save(order);

  return res.status(201).json({
    id: order.id,
    merchant_id: order.merchant_id,
    amount: order.amount,
    currency: order.currency,
    receipt: order.receipt,
    notes: order.notes || {},
    status: order.status,
    created_at: order.created_at.toISOString()
  });
}

export async function getOrder(req: AuthedRequest, res: Response) {
  const merchant = req.merchant!;
  const { order_id } = req.params;

  const repo = AppDataSource.getRepository(Order);
  const order = await repo.findOne({ where: { id: order_id, merchant_id: merchant.id } });

  if (!order) {
    return notFound(res, 'Order not found');
  }

  return res.status(200).json({
    id: order.id,
    merchant_id: order.merchant_id,
    amount: order.amount,
    currency: order.currency,
    receipt: order.receipt,
    notes: order.notes || {},
    status: order.status,
    created_at: order.created_at.toISOString(),
    updated_at: order.updated_at.toISOString()
  });
}

// Public endpoint for checkout
export async function getOrderPublic(req: any, res: Response) {
  const { order_id } = req.params;
  const repo = AppDataSource.getRepository(Order);
  const order = await repo.findOne({ where: { id: order_id } });
  if (!order) {
    return notFound(res, 'Order not found');
  }
  return res.status(200).json({
    id: order.id,
    amount: order.amount,
    currency: order.currency,
    status: order.status
  });
}
