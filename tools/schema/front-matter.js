module.exports = {
  properties: {
    title: {
      type: ["string", "integer"],
      required: true,
    },
    authors: {
      type: "array",
    },
    date: {
      conform: (value) => {
        return value instanceof Date;
      },
      message: "must be a valid date",
    },
    lang: {
      pattern: /^[a-z]{2}$/,
      message: "must be a 2-letter ISO 639-1 code",
      required: true,
    },
    description: {
      type: "string",
      maxLength: 200,
    },
    draft: {
      type: "boolean",
    },
    location: {
      type: "string",
    },
    audio: {
      type: "string",
    },
    video: {
      type: "string",
    },
    editors: {
      type: "array",
    },
    translators: {
      type: "array",
    },
    transcribers: {
      type: "array",
    },
    slug: {
      type: "string",
    },
    tags: {
      type: "array",
    },
    image: {
      type: "string",
    },
  },
};
