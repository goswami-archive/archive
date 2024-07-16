import Joi from "joi";

export default Joi.object({
  type: Joi.string().valid("category", "playlist").required(),

  title: Joi.string().required(),

  lang: Joi.string()
    .pattern(/^[a-z]{2}$/)
    .required()
    .messages({
      "string.pattern.base": "must be a 2-letter ISO 639-1 code",
    }),

  description: Joi.string().max(200),

  slug: Joi.string(),

  image: Joi.object({
    desktop: Joi.string().required(),
    mobile: Joi.string(),
    alt: Joi.string().required(),
  }),
});
