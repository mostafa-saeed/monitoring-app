import { Router } from 'express';
import asyncMiddleware from '../common/async.middleware.js';
import validationMiddleware from '../common/validation.middleware.js';
import { isLoggedIn } from './auth.service.js';
import usersController from './users.controller.js';
import createUserSchema from './schemas/createUser.schema.js';
import loginSchema from './schemas/login.schema.js';
import verifySchema from './schemas/verify.schema.js';

const router = new Router();

router.post('/', validationMiddleware.body(createUserSchema), asyncMiddleware(usersController.create));

router.post('/login', validationMiddleware.body(loginSchema), asyncMiddleware(usersController.login));

router.post('/verify', validationMiddleware.body(verifySchema), asyncMiddleware(usersController.verify));

router.get('/me', isLoggedIn, asyncMiddleware(usersController.me));

export default router;
