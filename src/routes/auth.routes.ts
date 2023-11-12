import asyncWrapper from '../lib/async-wrapper';
import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import Validator from '../middleware/validator.middleware';

const router = Router();
const controller = new AuthController();
const validator = new Validator();

router.get('/refresh', asyncWrapper(controller.refresh));
router.post('/login', validator.login, asyncWrapper(controller.login));
router.post('/logout', asyncWrapper(controller.logout));

export { router as _AuthRoutes };
