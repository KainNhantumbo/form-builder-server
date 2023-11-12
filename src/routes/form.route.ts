import { Router } from 'express';
import asyncWrapper from '../lib/async-wrapper';
import authenticate from '../middleware/auth.middleware';
import FormController from '../controllers/form.controller';
import Validator from '../middleware/validator.middleware';

const router = Router();
const controller = new FormController();
const validator = new Validator();

router
  .route('/')
  .get(authenticate, asyncWrapper(controller.getForms))
  .post(
    authenticate,
    asyncWrapper(validator.form),
    asyncWrapper(controller.createForm)
  );

router
  .route('/:id')
  .get(authenticate, asyncWrapper(controller.getForm))
  .patch(
    authenticate,
    asyncWrapper(validator.form),
    asyncWrapper(controller.updateForm)
  )
  .delete(authenticate, asyncWrapper(controller.deleteForm));

export { router as _FormRoutes };
