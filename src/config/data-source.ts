import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import User from '../models/User';

dotenv.config(); // imports env variables

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: false,
  entities: [User],
  subscribers: [],
  migrations: []
});

export default { connect: async () => await AppDataSource.initialize() };
