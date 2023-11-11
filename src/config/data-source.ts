import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import User from '../entities/User';
import Form from '../entities/Form'
import FormSubmission from '../entities/FormSubmission'

dotenv.config(); // imports env variables

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Form, FormSubmission],
  subscribers: [],
  migrations: []
});

export default { connect: async () => await AppDataSource.initialize() };
