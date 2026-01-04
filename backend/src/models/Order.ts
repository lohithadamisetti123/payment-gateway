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

  @Column({ type: 'varchar', length: 3, default: 'INR' })
  currency!: string;

  // CHANGE 1: make it just string, no union
  @Column({ type: 'varchar', length: 255, nullable: true })
  receipt!: string;

  // CHANGE 2: use any instead of unknown (safer for metadata)
  @Column({ type: 'jsonb', nullable: true })
  notes!: Record<string, any> | null;

  @Column({ type: 'varchar', length: 20, default: 'created' })
  status!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
