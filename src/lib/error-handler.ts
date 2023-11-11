import {
  DataTypeNotSupportedError,
  ErrorDescription,
  WriteError
} from 'typeorm';
import AppError from './app-error';
import EventLogger from './event-logger';
import { IReq, IRes, INext } from '../types';
import { JsonWebTokenError } from 'jsonwebtoken';

/**
 * Global error handler middleware.
 * @param error error object
 * @param req request
 * @param res response
 * @param next next middleware Function
 */
export default class ErrorHandler {
  static genericHandler(err: AppError, res: IRes) {
    const { message, statusCode }: AppError = err;
    return res.status(statusCode).json({
      message,
      code: statusCode
    });
  }

  static handler(error: Error, req: IReq, res: IRes, next: INext) {
    if (error instanceof AppError) {
      const { message, statusCode }: AppError = error;
      return res.status(statusCode).json({
        message,
        code: statusCode
      });
    }

    if (error.name === 'PayloadTooLargeError')
      return res.status(413).json({
        status: 'PayloadTooLargeError',
        code: 413,
        message: 'The file choosen is too large'
      });

    if (error instanceof JsonWebTokenError)
      return res.status(401).json({
        status: 'Authorization Error',
        code: 401,
        message: 'Unauthorized: invalid credentials.'
      });

    if (error.name === 'UploadApiErrorResponse') {
      return res.status(400).json({
        status: error.name,
        code: 400,
        message: error.message
      });
    }

    if (error instanceof WriteError) {
      const errorMessage = (error as ErrorDescription).message || error.message;
      return res.status(400).json({
        status: 'Data Validation Error',
        code: 400,
        message: errorMessage
      });
    }

    if (error instanceof DataTypeNotSupportedError) {
      const errorMessage = (error as ErrorDescription).message || error.message;
      return res.status(400).json({
        status: 'Data Validation Error',
        code: 400,
        message: errorMessage
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'Malformed Data Error',
        code: 400,
        message: 'Some of the data sent to the server was malformed.'
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.error(
        `An uncaught error has ocurred: \n\n ${error.message}\n\t${error.stack}`
      );
      new EventLogger({
        message: error.stack ?? error.message,
        fileName: 'uncaught-errors.log'
      }).register();
    }

    res.status(500).json({
      status: 'Internal Server Error',
      code: 500,
      message:
        'An error occurred while processing your request. Please try again later.'
    });
  }
}
