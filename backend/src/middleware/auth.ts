import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Merchant } from '../models/Merchant';
import { authError } from '../services/errorResponse';

export interface AuthedRequest extends Request {
  merchant?: Merchant;
}

export async function authMiddleware(req: AuthedRequest, res: Response, next: NextFunction) {
  const apiKey = req.header('X-Api-Key');
  const apiSecret = req.header('X-Api-Secret');

  if (!apiKey || !apiSecret) {
    return authError(res);
  }

  const merchantRepo = AppDataSource.getRepository(Merchant);
  const merchant = await merchantRepo.findOne({ where: { api_key: apiKey, api_secret: apiSecret } });

  if (!merchant || !merchant.is_active) {
    return authError(res);
  }

  req.merchant = merchant;
  next();
}
