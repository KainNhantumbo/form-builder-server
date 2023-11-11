import {
  Request as IReq,
  Response as IRes,
  NextFunction as INext
} from 'express';
import { HandledFunction } from '../types/index';

/**
 * Wrapper function for global error handling.
 * @param fn asynchronous function to be wrapped and error handled.
 * @returns Promise<...>
 */
export default function asyncWrapper(fn: HandledFunction) {
  return function (req: IReq, res: IRes, next: INext) {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
}
