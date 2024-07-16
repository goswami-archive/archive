import Joi from "joi";

export default Joi.object({
  type: Joi.string().valid("post").required(),

  title: Joi.string().required(),

  authors: Joi.array().items(Joi.string()).min(1).required(),

  date: Joi.string()
    .pattern(
      /^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/,
      "YYYY-MM-DD"
    )
    .messages({
      "string.pattern.base": "'date' must be a date in the format YYYY:MM:DD",
    }),

  lang: Joi.string()
    .pattern(/^[a-z]{2}$/)
    .required()
    .messages({
      "string.pattern.base": "`lang` must be a 2-letter ISO 639-1 code",
    }),

  description: Joi.string().max(200),

  draft: Joi.boolean(),

  location: Joi.string(),

  audio: Joi.string(),
    //   when("duration", {
    //   is: Joi.exist(),
    //   then: Joi.required(),
    // })

  duration: Joi.string()
    .pattern(/^[0-9]{2}:[0-9]{2}:[0-9]{2}$/, "HH:MM:SS")
    // .when("audio", {
    //   is: Joi.exist(),
    //   then: Joi.required(),
    // })
    .messages({
      "string.pattern.base":
        "'duration' must be a string in the format HH:MM:SS",
    }),

  video: Joi.string(),

  editors: Joi.array().items(Joi.string()).min(1),

  translators: Joi.array().items(Joi.string()).min(1),

  transcribers: Joi.array().items(Joi.string()).min(1),

  slug: Joi.string(),

  tags: Joi.array().items(Joi.string()),

  image: Joi.object({
    desktop: Joi.string().required(),
    mobile: Joi.string(),
    alt: Joi.string().required(),
  }),
});
