import asyncWrapper from '../lib/async-wrapper';
import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const router = Router();
const controller = new AuthController();

router.get('/refresh', asyncWrapper(controller.refresh));
router.post('/login', asyncWrapper(controller.login));
router.post('/logout', asyncWrapper(controller.logout));

export { router as _AuthRoutes };
