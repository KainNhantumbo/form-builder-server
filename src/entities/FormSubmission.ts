import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import Form from './Form';

@Entity({ name: 'form' })
export default class FormSubmission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Form, (form) => form.submissions)
  @JoinColumn({ name: 'form_id' })
  form_id!: Form;
  @Column({ type: 'array', default: [] })

  form!: Form[];

  @CreateDateColumn({ type: 'date' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'date' })
  updated_at!: Date;
}
