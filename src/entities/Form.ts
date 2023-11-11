import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'form' })
export default class Form extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: string;

  @Column({ length: 64, unique: true })
  name!: string;

  @Column({ type: 'text', length: 256 })
  description!: string;

  @Column({ type: 'array', default: [] })
  content!: [];

  @Column({ type: 'integer', default: 0 })
  visits!: number;

  @Column({ type: 'integer', default: 0 })
  submissions!: number;

  @Column({ type: 'boolean', default: false })
  published!: boolean;

  @Column({ type: 'text' })
  shareUrl!: string;

  @CreateDateColumn({ type: 'date' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'date' })
  updated_at!: Date;
}
