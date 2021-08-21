import { badRequest } from '@hapi/boom';
import usersService from './users.service.js';
import { hashPassword, comparePassword, generateToken } from './auth.service.js';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default {
  async create(req, res) {
    const { email, password } = req.body;
    if (!email || !password) throw badRequest('MISSING_FIELDS');
    if (!EMAIL_REGEX.test(email)) throw badRequest('INVALID_EMAIL');

    const emailMatch = await usersService.findUser(email);
    if (emailMatch) throw badRequest('EMAIL_ALREADY_EXISTS');

    const hashedPassword = await hashPassword(password);
    const token = usersService.generateToken();

    const user = await usersService.create({
      email,
      password: hashedPassword,
      token,
    });
    res.json(usersService.userResponse(user));
  },

  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) throw badRequest('MISSING_FIELDS');

    const user = await usersService.findUser(email);
    if (!user) throw badRequest('INVALID_LOGIN');

    const matchedPassword = await comparePassword(password, user.password);
    if (!matchedPassword) throw badRequest('INVALID_LOGIN');

    if (user.token) throw badRequest('VERIFICATION_REQUIRED');

    res.send({
      token: generateToken({
        id: user._id,
        email: user.email,
      }),
    });
  },

  async verify(req, res) {
    const { token } = req.body;
    if (!token) throw badRequest('MISSING_TOKEN');

    const user = await usersService.findTokenUser(token);
    if (!user) throw badRequest('INVALID_TOKEN');

    await usersService.removeUserToken(user.email);
    res.json({ success: true });
  },

  me(req, res) {
    res.json(req.user);
  },
};
