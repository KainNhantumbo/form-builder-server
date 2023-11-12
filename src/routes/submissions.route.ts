import { Router } from 'express';
import authenticate from '../middleware/auth.middleware';
import asyncWrapper from '../lib/async-wrapper';
import SubmissionController from '../controllers/submission.controller';

const router = Router();
const controller = new SubmissionController();

router
  .route('/')
  .get(authenticate, asyncWrapper(controller.getSubmisions))
  .post(asyncWrapper(controller.createSubmisions));

router
  .route('/:id')
  .delete(authenticate, asyncWrapper(controller.deleteSubmisions));

export { router as _SubmissionsRoutes };
