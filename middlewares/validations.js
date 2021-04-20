const { celebrate, Joi } = require('celebrate');

const reg = /^https?:\/\/(www\.)?([a-z0-9-]*\.)?([a-z0-9-]*)\.([a-z0-9-]*)(\/[\w\-._~:?#[\]@!$&'()*+,;=]*)?/m;

module.exports.validateUserCreate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля "name" - 2',
      'string.max': 'Максимальная длина поля "name" - 30',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля "about" - 2',
      'string.max': 'Максимальная длина поля "about" - 30',
    }),
    email: Joi.string().required().email(),
    avatar: Joi.string().custom((v, helpers) => {
      if (reg.test(v)) {
        return v;
      }
      return helpers.message('Неверный адрес');
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Минимальная длина пароля - 8',
    }),
  }),
});

module.exports.validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Минимальная длина пароля - 8',
    }),
  }),
});

module.exports.validateUpdateUser = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.required(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля "name" - 2',
      'string.max': 'Максимальная длина поля "name" - 30',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля "about" - 2',
      'string.max': 'Максимальная длина поля "about" - 30',
    }),
  }),
});

module.exports.validateUpdateAvatar = celebrate({
  headers: Joi.object().keys({
  }).unknown(true),
  body: Joi.object().keys({
    avatar: Joi.string().regex(reg),
  }),
});

module.exports.validateGetUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
  headers: Joi.object().keys({
  }).unknown(true),
});

module.exports.validateCreateCard = celebrate({
  headers: Joi.object().keys({
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(reg).required(),
  }),
});

module.exports.validateAuthorize = celebrate({
  headers: Joi.object().keys({
  }).unknown(true),
});

module.exports.validateDeleteCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
  headers: Joi.object().keys({
  }).unknown(true),
});

module.exports.validatePutLike = celebrate({
  headers: Joi.object().keys({
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});
module.exports.validateDeleteLike = celebrate({
  headers: Joi.object().keys({
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});
