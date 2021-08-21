import { Router } from 'express';
import asyncMiddleware from '../common/asyncMiddleware.js';
import { isLoggedIn } from '../users/auth.service.js';
import checksController from './checks.controller.js';

const router = new Router();

router.post('/', isLoggedIn, asyncMiddleware(checksController.create));

router.get('/:checkId/report', isLoggedIn, asyncMiddleware(checksController.getCheckReport));

router.put('/:checkId', isLoggedIn, asyncMiddleware(checksController.update));

router.delete('/:checkId', isLoggedIn, asyncMiddleware(checksController.delete));

router.post('/:checkId/enable', isLoggedIn, asyncMiddleware(checksController.enable));

router.post('/:checkId/disable', isLoggedIn, asyncMiddleware(checksController.disable));

export default router;
