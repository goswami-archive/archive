import Joi from 'joi';
import { description, image, lang, slug } from './common.ts';

export default Joi.object({
  type: Joi.string().valid('category', 'playlist').required(),

  title: Joi.string().required(),

  lang: lang,

  description: description,

  slug: slug,

  image: image,
});
