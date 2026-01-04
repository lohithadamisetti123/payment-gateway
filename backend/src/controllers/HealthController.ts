import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';

export async function healthHandler(req: Request, res: Response) {
  let dbStatus = 'connected';
  try {
    await AppDataSource.query('SELECT 1');
  } catch {
    dbStatus = 'disconnected';
  }

  return res.status(200).json({
    status: 'healthy',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
}
