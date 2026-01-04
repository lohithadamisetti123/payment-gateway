import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Merchant } from '../models/Merchant';

export async function getTestMerchant(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(Merchant);
  const merchant = await repo.findOne({ where: { email: 'test@example.com' } });
  if (!merchant) {
    return res.status(404).json({ error: { code: 'NOT_FOUND_ERROR', description: 'Test merchant not found' } });
  }
  return res.json({
    id: merchant.id,
    email: merchant.email,
    api_key: merchant.api_key,
    seeded: true
  });
}
