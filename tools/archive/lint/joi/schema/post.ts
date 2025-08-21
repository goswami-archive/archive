import Joi from 'joi';
import { description, image, lang, slug } from './common.ts';

export default Joi.object({
  type: Joi.string().valid('post').required(),

  title: Joi.string().required(),

  authors: Joi.array().items(Joi.string()).min(1).required(),

  date: Joi.string()
    .pattern(
      /^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/,
      'YYYY-MM-DD'
    )
    .messages({
      'string.pattern.base': "'date' must be a date in the format YYYY:MM:DD",
    }),

  lang: lang,

  description: description,

  status: Joi.string().valid('draft', 'publish').required(),

  location: Joi.string(),

  audio: Joi.object({
    file: Joi.string().required(),
  })
    .unknown()
    .pattern(Joi.string(), Joi.string()),

  duration: Joi.alternatives()
    .conditional('audio', {
      is: Joi.exist(),
      then: Joi.string()
        .pattern(/^[0-9]{2}:[0-9]{2}:[0-9]{2}$/, 'HH:MM:SS')
        .required(),
      otherwise: Joi.forbidden(),
    })
    .messages({
      'string.pattern.base':
        "'duration' must be a string in the format HH:MM:SS",
    }),

  video: Joi.string(),

  editors: Joi.array().items(Joi.string()).min(1),

  translators: Joi.array().items(Joi.string()).min(1),

  transcribers: Joi.array().items(Joi.string()).min(1),

  slug: slug,

  tags: Joi.array().items(Joi.string()),

  image: image,

  license: Joi.string().required(),
});
