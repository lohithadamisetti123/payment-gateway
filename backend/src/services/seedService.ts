import { AppDataSource } from '../config/ormconfig';
import { Merchant } from '../models/Merchant';
import { config } from '../config/env';

export async function seedTestMerchant() {
  const repo = AppDataSource.getRepository(Merchant);
  const existing = await repo.findOne({ where: { email: config.testMerchantEmail } });
  if (existing) return;

  const merchant = repo.create({
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Test Merchant',
    email: config.testMerchantEmail,
    api_key: config.testApiKey,
    api_secret: config.testApiSecret,
    webhook_url: null,
    is_active: true
  });

  await repo.save(merchant);
}
