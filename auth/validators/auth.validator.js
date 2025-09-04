import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .trim()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
    }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base':
        'Password must contain uppercase, lowercase letters and a number',
    }),
  name: Joi.string().min(2).required().messages({
    'string.empty': 'name is required',
    'string.min': 'Name must be at least 2 characters',
  }),
});

export const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: true } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
    }),
  password: Joi.string().required().messages({
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is required',
  }),
});

export const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
