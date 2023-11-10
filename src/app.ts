import 'reflect-metadata';
import express from 'express';
import CreateServer from './modules/server';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { corsOptions } from './config/cors';
import { rateLimiter } from './config/rate-limiter';

//server configuration
dotenv.config();
const app = express();
const port = Number(process.env.PORT);

app.use(helmet());
app.use(corsOptions);
app.use(rateLimiter);
app.use(compression());
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

new CreateServer({ app, port });
