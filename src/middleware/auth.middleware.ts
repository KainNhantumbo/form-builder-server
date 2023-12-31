import * as dotenv from 'dotenv';
import AppError from '../lib/app-error';
import asyncWrapper from '../lib/async-wrapper';
import { verifyToken } from '../lib/jwt-async-functions';
import { INext, IReq, IRes } from '../types';

// loads environment variables
dotenv.config();

const authenticate = asyncWrapper(async (req: IReq, res: IRes, next: INext) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    throw new AppError('Unauthorized: invalid token.', 401);
  const token = authHeader.split(' ')[1];
  const decodedPayload = await verifyToken(
    token,
    String(process.env.ACCESS_TOKEN)
  );

  if (!decodedPayload) throw new AppError('Invalid creadentials.', 401);

  // inserts user id into request body middleware
  req.body.user = { id: decodedPayload.id };
  next();
});

export default authenticate;
