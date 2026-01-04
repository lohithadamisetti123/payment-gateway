import { DataSource } from 'typeorm';
import { config } from './env';
import { Merchant } from '../models/Merchant';
import { Order } from '../models/Order';
import { Payment } from '../models/Payment';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.databaseUrl,
  entities: [Merchant, Order, Payment],
  synchronize: true, // for assignment; in prod use migrations
  logging: false
});
