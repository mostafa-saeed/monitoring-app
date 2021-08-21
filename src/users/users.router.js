import { Router } from 'express';
import asyncMiddleware from '../common/asyncMiddleware.js';
import { isLoggedIn } from './auth.service.js';
import usersController from './users.controller.js';

const router = new Router();

router.post('/', asyncMiddleware(usersController.create));

router.post('/login', asyncMiddleware(usersController.login));

router.post('/verify', asyncMiddleware(usersController.verify));

router.get('/me', isLoggedIn, asyncMiddleware(usersController.me));

export default router;
