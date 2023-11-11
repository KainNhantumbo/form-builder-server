import {
  Column,
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import Form from '@/entities/Form';

@Entity({ name: 'user' })
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ length: 64 })
  first_name!: string;

  @Column({ length: 64 })
  last_name!: string;

  @Column({ length: 64, unique: true })
  email!: string;

  @Column({ type: 'text' })
  password!: string;

  @Column({ type: 'date' })
  last_session!: Date;

  @OneToMany(() => Form, (form) => form.user_id)
  forms!: Form[];

  @CreateDateColumn({ type: 'date' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'date' })
  updated_at!: Date;
}
