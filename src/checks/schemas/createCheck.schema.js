import Joi from 'joi';

const schema = Joi.object({
  name: Joi.string().required(),
  // url: Joi.string().domain().required(),
  // protocol: Joi.string().valid('http', 'https').default('http'),
  // path: Joi.string().default('/'),
  // port: Joi.number().default(80),
  fullURL: Joi.string().uri().required(),
  webhook: Joi.string().uri(),
  timeout: Joi.number().min(1).max(30).default(5),
  interval: Joi.number().min(1).max(30).default(10),
  threshold: Joi.number().min(1).default(1),
  authentication: Joi.object({
    username: Joi.string(),
    password: Joi.string(),
  }),
  httpHeaders: Joi.object(),
  assert: Joi.object({
    statusCode: Joi.number(),
  }),
  tags: Joi.array().items(Joi.string()),
  ignoreSSL: Joi.boolean().default(false),
});

export default schema;
