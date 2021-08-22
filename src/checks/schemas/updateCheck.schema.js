import Joi from 'joi';

const schema = Joi.object({
  name: Joi.string(),
  fullURL: Joi.string().uri(),
  webhook: Joi.string().uri(),
  timeout: Joi.number().min(1).max(30),
  interval: Joi.number().min(1).max(30),
  threshold: Joi.number().min(1),
  authentication: Joi.object({
    username: Joi.string(),
    password: Joi.string(),
  }),
  httpHeaders: Joi.object(),
  assert: Joi.object({
    statusCode: Joi.number(),
  }),
  tags: Joi.array().items(Joi.string()),
  ignoreSSL: Joi.boolean(),
});

export default schema;
