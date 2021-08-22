import { Router } from 'express';
import asyncMiddleware from '../common/asyncMiddleware.js';
import validationMiddleware from '../common/validation.middleware.js';
import { isLoggedIn } from '../users/auth.service.js';
import checksController from './checks.controller.js';
import createCheckSchema from './schemas/createCheck.schema.js';
import updateCheckSchema from './schemas/updateCheck.schema.js';

const router = new Router();

router.post(
  '/', isLoggedIn, validationMiddleware.body(createCheckSchema),
  asyncMiddleware(checksController.create),
);

router.get('/:checkId/report', isLoggedIn, asyncMiddleware(checksController.getCheckReport));

router.put(
  '/:checkId', isLoggedIn, validationMiddleware.body(updateCheckSchema),
  asyncMiddleware(checksController.update),
);

router.delete('/:checkId', isLoggedIn, asyncMiddleware(checksController.delete));

router.post('/:checkId/enable', isLoggedIn, asyncMiddleware(checksController.enable));

router.post('/:checkId/disable', isLoggedIn, asyncMiddleware(checksController.disable));

export default router;
