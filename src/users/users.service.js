import { randomBytes } from 'crypto';
import Users from './schemas/user.schema.js';

export default {
  create(userPayload) {
    return Users.create(userPayload);
  },

  findUser(email) {
    return Users.findOne({ email });
  },

  findTokenUser(token) {
    return Users.findOne({ token });
  },

  removeUserToken(email) {
    return Users.findOneAndUpdate({ email }, {
      $unset: { token: '' },
    });
  },

  generateToken() {
    return randomBytes(20).toString('hex');
  },

  userResponse(user) {
    return {
      id: user._id,
      email: user.email,
    };
  },
};
