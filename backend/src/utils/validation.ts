import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const postSchema = Joi.object({
  content: Joi.string().max(500).required(),
});

export const commentSchema = Joi.object({
  text: Joi.string().max(300).required(),
  postId: Joi.string().required(),
});