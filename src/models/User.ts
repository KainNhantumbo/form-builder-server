import { Column, Entity,  PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'User' })
export default class User {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ length: 64 })
  first_name: string;

  @Column({ length: 64 })
  last_name: string;

  @Column({ length: 64 })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'date' })
  last_session: Date;
  
  @Column({ type: 'date' })
  created_at: Date;
  
  @Column({ type: 'date' })
  updated_at: Date;
}
