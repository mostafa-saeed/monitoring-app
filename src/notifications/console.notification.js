import { log } from 'console';

export default {
  condition() {
    return true;
  },

  async handler(check, newStatus) {
    log(`${check.name} is now ${newStatus}`);
  },
};
