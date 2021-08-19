import axios from 'axios';

export default {
  condition(check) {
    return !!check.webhook;
  },

  async handler(check, newStatus) {
    return axios.post(check.webhook, { ...check, newStatus });
  },
};
