import {
  Entity, PrimaryColumn, Column, ManyToOne,
  CreateDateColumn, UpdateDateColumn, Index, JoinColumn
} from 'typeorm';
import { Merchant } from './Merchant';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryColumn({ length: 64 })
  id!: string; // order_ + 16 chars

  @Index()
  @Column('uuid')
  merchant_id!: string;

  @ManyToOne(() => Merchant)
  @JoinColumn({ name: 'merchant_id' })
  merchant!: Merchant;

  @Column('integer')
  amount!: number;

  @Column({ length: 3, default: 'INR' })
  currency!: string;

  @Column({ length: 255, nullable: true })
  receipt!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  notes!: Record<string, unknown> | null;

  @Column({ length: 20, default: 'created' })
  status!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
