export default {
  properties: {
    type: {
      type: "string",
      enum: ["post"],
      required: true,
    },
    title: {
      type: ["string"],
      required: true,
      allowEmpty: false,
    },
    authors: {
      type: "array",
      required: true,
      allowEmpty: false,
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
      allowEmpty: false,
    },
    draft: {
      type: "boolean",
    },
    location: {
      type: "string",
      allowEmpty: false,
    },
    audio: {
      type: "string",
      allowEmpty: false,
    },
    video: {
      type: "string",
      allowEmpty: false,
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
      allowEmpty: false,
    },
    tags: {
      type: "array",
    },
    image: {
      type: "object",
      properties: {
        desktop: {
          type: "string",
          required: true,
          allowEmpty: false,
        },
        mobile: {
          type: "string",
          allowEmpty: false,
        },
        alt: {
          type: "string",
          required: true,
          allowEmpty: false,
        },
      },
    },
  },
};
