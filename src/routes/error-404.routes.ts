import { Router } from 'express';
import type { IReq, IRes } from '../types';

const router = Router();

router.route('*').all(function (req: IReq, res: IRes) {
  res.status(404).json({
    code: 404,
    status: 'Route not found.',
    message: 'This route cannot be reached, check the url and try again.'
  });
});

export { router as _404Route };
