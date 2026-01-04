import { Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Payment } from '../models/Payment';
import { Order } from '../models/Order';
import { AuthedRequest } from '../middleware/auth';
import { badRequest, notFound } from '../services/errorResponse';
import { generatePaymentId } from '../services/idGenerator';
import {
  isValidVPA,
  isValidCardNumberLuhn,
  detectCardNetwork,
  isExpiryValid
} from '../services/validationService';
import { config } from '../config/env';

async function processPaymentEntity(payment: Payment, method: 'upi' | 'card') {
  // Determine delay
  let delayMs: number;
  if (config.testMode) {
    delayMs = config.testProcessingDelay || 1000;
  } else {
    const min = parseInt(process.env.PROCESSING_DELAY_MIN || '5000', 10);
    const max = parseInt(process.env.PROCESSING_DELAY_MAX || '10000', 10);
    delayMs = Math.floor(Math.random() * (max - min + 1)) + min;
  }

  await new Promise((resolve) => setTimeout(resolve, delayMs));

  let success: boolean;
  if (config.testMode) {
    success = config.testPaymentSuccess;
  } else {
    const rand = Math.random();
    if (method === 'upi') {
      success = rand < config.upiSuccessRate;
    } else {
      success = rand < config.cardSuccessRate;
    }
  }

  const repo = AppDataSource.getRepository(Payment);
  if (success) {
    payment.status = 'success';
    payment.error_code = null;
    payment.error_description = null;
  } else {
    payment.status = 'failed';
    payment.error_code = 'PAYMENT_FAILED';
    payment.error_description = 'Payment processing failed';
  }
  await repo.save(payment);
}

export async function createPayment(req: AuthedRequest, res: Response) {
  const merchant = req.merchant!;
  return createPaymentInternal(req.body, merchant.id, res);
}

// Public version (no auth) used by checkout
export async function createPaymentPublic(req: any, res: Response) {
  const { order_id } = req.body || {};
  if (!order_id) {
    return badRequest(res, 'order_id is required');
  }
  const orderRepo = AppDataSource.getRepository(Order);
  const order = await orderRepo.findOne({ where: { id: order_id } });
  if (!order) {
    return notFound(res, 'Order not found');
  }
  return createPaymentInternal(req.body, order.merchant_id, res);
}

async function createPaymentInternal(body: any, merchantId: string, res: Response) {
  const { order_id, method } = body || {};
  if (!order_id || !method) {
    return badRequest(res, 'order_id and method are required');
  }

  const orderRepo = AppDataSource.getRepository(Order);
  const order = await orderRepo.findOne({ where: { id: order_id, merchant_id: merchantId } });

  if (!order) {
    return notFound(res, 'Order not found');
  }

  const paymentRepo = AppDataSource.getRepository(Payment);

  let id: string;
  while (true) {
    id = generatePaymentId();
    const existing = await paymentRepo.findOne({ where: { id } });
    if (!existing) break;
  }

  const payment = paymentRepo.create({
  id,
  order_id: order.id,
  merchant_id: merchantId,
  amount: order.amount,
  currency: order.currency,
  method,
  status: 'processing',
  vpa: null,
  card_network: null,
  card_last4: null,
  error_code: null,
  error_description: null
});


  if (method === 'upi') {
    const { vpa } = body;
    if (!vpa || !isValidVPA(vpa)) {
      return badRequest(res, 'Invalid VPA format', 'INVALID_VPA');
    }
    payment.vpa = vpa;
  } else if (method === 'card') {
    const { card } = body;
    if (!card) {
      return badRequest(res, 'card object is required', 'INVALID_CARD');
    }
    const { number, expiry_month, expiry_year, cvv, holder_name } = card;
    if (!number || !expiry_month || !expiry_year || !cvv || !holder_name) {
      return badRequest(res, 'Missing card fields', 'INVALID_CARD');
    }
    if (!isValidCardNumberLuhn(number)) {
      return badRequest(res, 'Card validation failed', 'INVALID_CARD');
    }
    if (!isExpiryValid(expiry_month, expiry_year)) {
      return badRequest(res, 'Card expiry date invalid', 'EXPIRED_CARD');
    }

    const clean = number.replace(/[\s-]/g, '');
    payment.card_network = detectCardNetwork(clean);
    payment.card_last4 = clean.slice(-4);
  } else {
    return badRequest(res, 'Unsupported method', 'BAD_REQUEST_ERROR');
  }

  await paymentRepo.save(payment);

  // Start processing (sync for Deliverable 1)
  await processPaymentEntity(payment, method);

  // Reload payment
  const finalPayment = await paymentRepo.findOneOrFail({ where: { id: payment.id } });

  const response: any = {
    id: finalPayment.id,
    order_id: finalPayment.order_id,
    amount: finalPayment.amount,
    currency: finalPayment.currency,
    method: finalPayment.method,
    status: finalPayment.status,
    created_at: finalPayment.created_at.toISOString()
  };
  if (finalPayment.method === 'upi') {
    response.vpa = finalPayment.vpa;
  } else if (finalPayment.method === 'card') {
    response.card_network = finalPayment.card_network;
    response.card_last4 = finalPayment.card_last4;
  }

  return res.status(201).json(response);
}

export async function getPayment(req: AuthedRequest, res: Response) {
  const merchant = req.merchant!;
  const { payment_id } = req.params;

  const repo = AppDataSource.getRepository(Payment);
  const payment = await repo.findOne({ where: { id: payment_id, merchant_id: merchant.id } });

  if (!payment) {
    return notFound(res, 'Payment not found');
  }

  const response: any = {
    id: payment.id,
    order_id: payment.order_id,
    amount: payment.amount,
    currency: payment.currency,
    method: payment.method,
    status: payment.status,
    created_at: payment.created_at.toISOString(),
    updated_at: payment.updated_at.toISOString()
  };
  if (payment.method === 'upi') {
    response.vpa = payment.vpa;
  } else if (payment.method === 'card') {
    response.card_network = payment.card_network;
    response.card_last4 = payment.card_last4;
  }

  return res.status(200).json(response);
}
