import Checks from './schemas/check.schema.js';

const MILLISECONDS_IN_MINUTE = 60_000;

const DEFAULT_CHECK_OPTIONS = {
  timeout: 5,
  interval: 10,
  threshold: 1,
};

export default {
  create(check) {
    check = Object.assign({}, DEFAULT_CHECK_OPTIONS, check);
    check.nextCheck = Date.now() + check.interval * MILLISECONDS_IN_MINUTE;
    return Checks.create(check);
  },

  findById(id) {
    return Checks.findById(id);
  },

  findByUser(userId) {
    return Checks.find({ user: userId });
  },

  findReady() {
    return Checks.find({
      isActive: true,
      nextCheck: { $lte: Date.now() },
    });
  },
};
