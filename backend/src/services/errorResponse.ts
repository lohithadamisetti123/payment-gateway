import { Response } from 'express';

export function authError(res: Response, description = 'Invalid API credentials') {
  return res.status(401).json({
    error: { code: 'AUTHENTICATION_ERROR', description }
  });
}

export function badRequest(res: Response, description: string, code = 'BAD_REQUEST_ERROR') {
  return res.status(400).json({
    error: { code, description }
  });
}

export function notFound(res: Response, description: string) {
  return res.status(404).json({
    error: { code: 'NOT_FOUND_ERROR', description }
  });
}

export function paymentFailed(res: Response, description: string) {
  return res.status(400).json({
    error: { code: 'PAYMENT_FAILED', description }
  });
}
