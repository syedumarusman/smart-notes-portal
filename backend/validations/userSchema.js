const Joi = require('joi');
const { USER_ROLES: { admin, user } } = require('../utils/constants');

const createSchema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required().min(4),
    role: Joi.string().valid(admin, user).required(),
    email: Joi.string().email().required()
});

const getUserSchema = Joi.object({
  userId: Joi.string().required()
})

const loginUsernameSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
})

const loginEmailSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const updateSchema = Joi.object({
    userId: Joi.string(),
    name: Joi.string(),
    password: Joi.string().min(4),  
    role: Joi.string().valid(admin, user),
    email: Joi.string().email()
})

const FileSchema = Joi.object({
  userId: Joi.string().required(),
  description: Joi.string().max(100).required(),
  gcs_uri: Joi.string().required(),
  created: Joi.string().required()
})

const removeFileSchema = Joi.object({
  userId: Joi.string(),
  _id: Joi.string(),
  gcs_uri: Joi.string(),
})

const removeSchema = Joi.object({
  userId: Joi.string().required()  
})

const manuscriptSchema = Joi.object({
  userId: Joi.string().required(),
  file: Joi.object().required()
})

const addFeedbackSchema = Joi.object({
  userId: Joi.string().required(),
  feedbackType: Joi.string().valid("manuscript","summary").required(),
  q1: Joi.string().required(),  
  q2: Joi.string().required(),  
  q3: Joi.string().required(),
  comment: Joi.string().max(500).required()
})

module.exports = { getUserSchema, loginUsernameSchema, loginEmailSchema, createSchema, resetPasswordSchema, updateSchema, FileSchema, removeFileSchema, removeSchema, manuscriptSchema, addFeedbackSchema }