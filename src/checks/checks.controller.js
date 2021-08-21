import { notFound } from '@hapi/boom';
import checksService from './checks.service.js';
import responsesService from '../responses/responses.service.js';

export default {
  async create(req, res) {
    const { body } = req;
    const { id } = req.user;
    const check = await checksService.create(body, id);

    res.json(check);
  },

  async getCheckReport(req, res) {
    const { checkId } = req.params;
    const { id } = req.user;
    const check = await checksService.findOne(checkId, id);
    if (!check) throw notFound('CHECK_NOT_FOUND');

    const [report] = await responsesService.getReport(checkId);
    res.json(report);
  },
};
