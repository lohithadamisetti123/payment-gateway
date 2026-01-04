import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/ormconfig';
import { config } from './config/env';
import { seedTestMerchant } from './services/seedService';
import { healthHandler } from './controllers/HealthController';
import { getTestMerchant } from './controllers/TestController';
import { authMiddleware } from './middleware/auth';
import { createOrder, getOrder, getOrderPublic } from './controllers/OrderController';
import { createPayment, getPayment, createPaymentPublic } from './controllers/PaymentController';
import { getPaymentStats } from './controllers/StatsController';
import { listPayments } from './controllers/PaymentListController';
async function bootstrap() {
  await AppDataSource.initialize();
  await seedTestMerchant();

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Health
  app.get('/health', healthHandler);

  // Test endpoint
  app.get('/api/v1/test/merchant', getTestMerchant);

  // Public checkout endpoints
  app.get('/api/v1/orders/:order_id/public', getOrderPublic);
  app.post('/api/v1/payments/public', createPaymentPublic);

  // Auth-protected endpoints
  app.post('/api/v1/orders', authMiddleware, createOrder);
  app.get('/api/v1/orders/:order_id', authMiddleware, getOrder);

  app.post('/api/v1/payments', authMiddleware, createPayment);
  app.get('/api/v1/payments/:payment_id', authMiddleware, getPayment);

  app.get('/api/v1/payments-stats', authMiddleware, getPaymentStats);
  app.get('/api/v1/payments-list', authMiddleware, listPayments);
  app.listen(config.port, () => {
    console.log(`API listening on port ${config.port}`);

    
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
