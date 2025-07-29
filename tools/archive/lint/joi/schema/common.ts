import Joi from 'joi';

export const lang = Joi.string()
  .pattern(/^[a-z]{2}$/)
  .required()
  .messages({
    'string.pattern.base': '`lang` must be a 2-letter ISO 639-1 code',
  });

export const description = Joi.string().max(200);

export const slug = Joi.string()
  .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .min(1)
  .max(100)
  .required()
  .messages({
    'string.pattern.base':
      'Slug must contain only lowercase letters, numbers, and hyphens. Cannot start/end with hyphen or have consecutive hyphens.',
    'string.min': 'Slug must be at least 1 character long',
    'string.max': 'Slug must be no more than 100 characters long',
  });

export const image = Joi.object({
  desktop: Joi.string().required(),
  mobile: Joi.string(),
  alt: Joi.string().required(),
});
