import { Application } from 'express';
import { Response, Request, NextFunction } from 'express';

export type AppProps = { app: Application; dbUri: string; port: number };

export type LoggerProps = { message: string; fileName: string };

export type HandledFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response<void>>;

export type ValidatorResponse = { status: boolean; message: string };
export type { Response as IRes, Request as IReq, NextFunction as INext };
