import 'reflect-metadata';
import helmet from 'helmet';
import express from 'express';
import * as dotenv from 'dotenv';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors';
import CreateServer from './modules/server';
import { rateLimiter } from './config/rate-limiter';

//server configuration
dotenv.config();
const app = express();
const port = Number(process.env.PORT);

app.use(helmet());
app.use(corsOptions);
app.use(rateLimiter);
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

new CreateServer({ app, port });
