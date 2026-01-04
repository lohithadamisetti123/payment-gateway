import {
  Entity, PrimaryColumn, Column, ManyToOne,
  CreateDateColumn, UpdateDateColumn, Index, JoinColumn
} from 'typeorm';
import { Merchant } from './Merchant';
import { Order } from './Order';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryColumn({ length: 64 })
  id!: string; // pay_ + 16 chars

  @Index()
  @Column({ length: 64 })
  order_id!: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @Column('uuid')
  merchant_id!: string;

  @ManyToOne(() => Merchant)
  @JoinColumn({ name: 'merchant_id' })
  merchant!: Merchant;

  @Column('integer')
  amount!: number;

  @Column({ length: 3, default: 'INR' })
  currency!: string;

  @Column({ length: 20 })
  method!: string; // upi | card

  @Index()
  @Column({ length: 20, default: 'created' })
  status!: string; // will be 'processing' then success/failed

  @Column({ length: 255, nullable: true })
  vpa!: string | null;

  @Column({ length: 20, nullable: true })
  card_network!: string | null;

  @Column({ length: 4, nullable: true })
  card_last4!: string | null;

  @Column({ length: 50, nullable: true })
  error_code!: string | null;

  @Column({ type: 'text', nullable: true })
  error_description!: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
