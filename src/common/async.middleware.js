import { badImplementation } from '@hapi/boom';

export default (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (!err.isBoom) {
      return next(badImplementation(err));
    }
    return next(err);
  });
};
