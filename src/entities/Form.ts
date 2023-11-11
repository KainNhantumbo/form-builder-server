import {
  JoinColumn,
  BaseEntity,
  ManyToOne,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import User from '@/entities/User';
import FormSubmission from '@/entities/FormSubmission';

@Entity({ name: 'form' })
export default class Form extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.forms)
  @JoinColumn({ name: 'user_id' })
  user_id!: User;

  @Column({ length: 64, unique: true })
  name!: string;

  @Column({ type: 'text', length: 256 })
  description!: string;

  @Column({ type: 'array', default: [] })
  content!: [];

  @Column({ type: 'integer', default: 0 })
  visits!: number;

  @OneToMany(() => FormSubmission, (formSubmission) => formSubmission.form_id)
  submissions!: FormSubmission[];

  @Column({ type: 'boolean', default: false })
  published!: boolean;

  @Column({ type: 'text' })
  shareUrl!: string;

  @CreateDateColumn({ type: 'date' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'date' })
  updated_at!: Date;
}
