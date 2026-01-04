import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { AppDataSource } from '../config/ormconfig';
import { Payment } from '../models/Payment';

export async function listPayments(req: AuthedRequest, res: Response) {
  const merchant = req.merchant!;
  const repo = AppDataSource.getRepository(Payment);
  const payments = await repo.find({
    where: { merchant_id: merchant.id },
    order: { created_at: 'DESC' }
  });

  return res.json({
    payments: payments.map((p) => ({
      id: p.id,
      order_id: p.order_id,
      amount: p.amount,
      method: p.method,
      status: p.status,
      created_at: p.created_at.toISOString()
    }))
  });
}
