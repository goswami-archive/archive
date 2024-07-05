module.exports = {
  properties: {
    type: {
      type: "string",
      enum: ["category", "playlist"],
      required: true,
    },
    title: {
      type: ["string"],
      required: true,
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
    slug: {
      type: "string",
    },
    image: {
      type: "object",
      properties: {
        desktop: {
          type: "string",
          required: true,
        },
        mobile: {
          type: "string",
        },
        alt: {
          type: "string",
          required: true,
        },
      },
    },
  },
};
