import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config(); // imports env variables

export const allowedDomains: string[] =
  String(process.env.ALLOWED_DOMAINS).split(',');

export const corsOptions = cors({
  origin: allowedDomains,
  methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 200
});
