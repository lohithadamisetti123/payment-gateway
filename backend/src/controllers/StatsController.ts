import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { AppDataSource } from '../config/ormconfig';
import { Payment } from '../models/Payment';

export async function getPaymentStats(req: AuthedRequest, res: Response) {
  const merchant = req.merchant!;
  const repo = AppDataSource.getRepository(Payment);

  const payments = await repo.find({ where: { merchant_id: merchant.id } });

  const totalTransactions = payments.length;
  const successful = payments.filter((p) => p.status === 'success');
  const totalAmount = successful.reduce((sum, p) => sum + p.amount, 0);
  const successRate = totalTransactions === 0 ? 0 : Math.round((successful.length / totalTransactions) * 100);

  return res.json({
    totalTransactions,
    totalAmount,
    successRate
  });
}
