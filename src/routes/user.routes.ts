import { Router } from 'express';
import asyncWrapper from '../lib/async-wrapper';
import authenticate from '../middleware/auth.middleware';
import UserController from '../controllers/user.controller';
import Validator from '../middleware/validator.middleware';

const router = Router();
const controller = new UserController();
const validator = new Validator();

router
  .route('/')
  .get(authenticate, asyncWrapper(controller.getUser))
  .post(asyncWrapper(validator.signup), asyncWrapper(controller.createUser))
  .patch(authenticate, asyncWrapper(controller.updateUser))
  .delete(authenticate, asyncWrapper(controller.deleteUser));

export { router as _UserRoutes };
