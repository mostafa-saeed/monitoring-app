import Joi from 'joi';

const schema = Joi.object({
  token: Joi.string().required(),
});

export default schema;
