import { Router } from 'express';
import checksController from './checks.controller.js';

const router = new Router();

router.post('/', checksController.create);

router.get('/:checkId/report', checksController.getCheckReport);

export default router;
