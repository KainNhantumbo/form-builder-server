import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config(); // imports env variables

export const sequelize = new Sequelize(
  String(process.env.DATABASE),
  String(process.env.DATABASE_USERNAME),
  String(process.env.DATABASE_PASSWORD),
  {
    host: String(process.env.DATABASE_HOST),
    port: Number(process.env.DATABASE_PORT),
    dialect: 'postgres',
    sync: { force: true },
    logging: false
  }
);
