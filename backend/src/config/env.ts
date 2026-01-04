import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '8000', 10),
  databaseUrl: process.env.DATABASE_URL as string,
  testMode: process.env.TEST_MODE === 'true',
  testPaymentSuccess: process.env.TEST_PAYMENT_SUCCESS !== 'false',
  testProcessingDelay: parseInt(process.env.TEST_PROCESSING_DELAY || '1000', 10),

  upiSuccessRate: parseFloat(process.env.UPI_SUCCESS_RATE || '0.9'),
  cardSuccessRate: parseFloat(process.env.CARD_SUCCESS_RATE || '0.95'),

  testMerchantEmail: process.env.TEST_MERCHANT_EMAIL || 'test@example.com',
  testApiKey: process.env.TEST_API_KEY || 'key_test_abc123',
  testApiSecret: process.env.TEST_API_SECRET || 'secret_test_xyz789'
};
