import checksService from './checks.service.js';
import responsesService from '../responses/responses.service.js';

export default {
  async create(req, res) {
    const { body } = req;
    const check = await checksService.create(body);

    res.json(check);
  },

  async getCheckReport(req, res) {
    const { checkId } = req.params;
    const [report] = await responsesService.getReport(checkId);
    res.json(report);
  },
};
