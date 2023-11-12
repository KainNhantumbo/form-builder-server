import helmet from 'helmet';
import express from 'express';
import * as dotenv from 'dotenv';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors';
import CreateServer from './modules/server';
import { rateLimiter } from './config/rate-limiter';
import { _AuthRoutes } from './routes/auth.routes';
import { _UserRoutes } from './routes/user.routes';
import { _FormRoutes } from './routes/form.route';
import { _HealthRoute } from './routes/healthcheck.routes';
import { _SubmissionsRoutes } from './routes/submissions.route';

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

app.use('/api/v1/healthcheck', _HealthRoute);
app.use('/api/v1/auth', _AuthRoutes);
app.use('/api/v1/users', _UserRoutes);
app.use('/api/v1/forms', _FormRoutes);
app.use('/api/v1/submissions', _SubmissionsRoutes);

new CreateServer({ app, port });
