const { ObjectId } = require('mongodb');
const Boom = require('boom');
const { User, FileSchema } = require('../models/user');
const { getNewToken } = require('../utils/jwtService');
const { JWT_SECRET_KEY } = require('../utils/constants');
const ValidationSchemas = require('../validations/userSchema');
const sendEmail = require('../utils/email');
const { deleteFile } = require("../utils/cloudServices");

const getAll = async (queryPayload) => {
    Object.keys(queryPayload).forEach(key => queryPayload[key] === undefined ? delete queryPayload[key] : {});
    return await User.find({ role: { $ne: queryPayload.exclude } });
}

const getUser = async (userId) => {
    const { error } = ValidationSchemas.getUserSchema.validate({ userId })
    if (error) {
        throw error;
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
        throw Boom.notFound('User does not exist');
    }
    return user;
}

const loginUserWithUsername = async (payload) => {
    const { error } = ValidationSchemas.loginUsernameSchema.validate(payload)
    if (error) {
        throw error;
    }
    const user = await User.findOne({ username: payload.username, password: payload.password })
    if (!user) {
        throw Boom.badRequest("Username or password is incorrect.");
    }
    const currentUser = {
        userId: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
    }
    const token = getNewToken(JWT_SECRET_KEY, currentUser);
    const response = { token, currentUser }
    return response;
}

const loginUserWithEmail = async (payload) => {
    const { error } = ValidationSchemas.loginEmailSchema.validate(payload)
    if (error) {
        throw error;
    }
    const user = await User.findOne({ email: payload.email, password: payload.password })
    if (!user) {
        throw Boom.badRequest("Email or password is incorrect.");
    }
    const token = getNewToken(JWT_SECRET_KEY, user)
    const currentUser = {
        userId: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
    }
    const response = { token, currentUser }
    return response;
}

const createUser = async (payload) => {
    const { error } = ValidationSchemas.createSchema.validate(payload);
    if (error) {
        throw error;
    }
    const user = await User.findOne({email: payload.email})
    if (user) {
        throw Boom.badRequest('This User already exists');
    }
    const response = await User.create(payload);
    return response;
}

const resetPassword = async (payload) => {
    const { error } = ValidationSchemas.resetPasswordSchema.validate(payload);
    if (error) {
        throw error;
    }
    const newPassword = Math.random().toString(36).substring(7);
    const updatedUser = await User.findOneAndUpdate(payload, { $set: { password: newPassword } }, 
        { useFindAndModify: false, new: true });
    if (!updatedUser) {
        throw Boom.notFound('User does not exist');
    }
    await sendEmail(updatedUser)
    return updatedUser;
}

const update = async (payload) => {
    const { error } = ValidationSchemas.updateSchema.validate(payload);
    if (error) {
        throw error;
    }
    const query = { _id: payload.userId };
    const user = await User.findOne(query);
    if (!user) {
        throw Boom.notFound('User does not exist')
    }
    user = await User.findByIdAndUpdate( payload.userId , payload, { new: true });
    return user;
}

const addSummaryFile = async (payload) => {
    const { error } = ValidationSchemas.FileSchema.validate(payload);
    if (error) {
        throw error;
    }
    const userId = ObjectId(payload.userId);
    const query = { _id: userId };
    const user = await User.findOne(query);
    if (!user) {
        throw Boom.notFound('User does not exist')
    }
    
    const { description, gcs_uri, created } = payload;
    const summaryFile = { description, gcs_uri, created };
    updatedUser = await User.findByIdAndUpdate( userId, { $push: { summaryFiles: summaryFile  } }, { new: true });
    return updatedUser;
}

const addAudioFile = async (payload) => {
    const { error } = ValidationSchemas.FileSchema.validate(payload);
    if (error) {
        throw error;
    }
    const userId = ObjectId(payload.userId);
    const query = { _id: userId };
    const user = await User.findOne(query);
    if (!user) {
        throw Boom.notFound('User does not exist')
    }
    const { description, gcs_uri, created } = payload;
    try{
        const newAudioFile = FileSchema({description, gcs_uri, created});
        console.log("newAudioFile: ", newAudioFile);
    } catch(err) {
        console.log(err);
    }

    // const audioFile = { description, gcs_uri, created };
    // updatedUser = await User.findByIdAndUpdate( userId, { $push: { audioFiles: audioFile  } }, { new: true });
    // return updatedUser;
}

const removeSummaryFile = async (payload) => {
    const { error } = ValidationSchemas.removeFileSchema.validate(payload);
    if (error) {
        throw error;
    }
    const userId = ObjectId(payload.userId);
    const query = { _id: userId };
    const user = await User.findOne(query);
    if (!user) {
        throw Boom.notFound('User does not exist')
    }
    const bucketName = "capstone-summaries"
    const fileName = payload.gcs_uri.split("/").slice(-1)[0];    
    await deleteFile(bucketName, fileName);
    updatedUser = await User.findByIdAndUpdate( userId, {
        $pull: { summaryFiles: { _id: payload._id } } }, { new: true });
    return updatedUser;
}

const removeAudioFile = async (payload) => {
    const { error } = ValidationSchemas.removeFileSchema.validate(payload);
    if (error) {
        throw error;
    }
    const userId = ObjectId(payload.userId);
    const query = { _id: userId };
    const user = await User.findOne(query);
    if (!user) {
        throw Boom.notFound('User does not exist')
    }
    const bucketName = "capstone-audios";
    const fileName = payload.gcs_uri.split("/").slice(-1)[0];
    await deleteFile(bucketName, fileName);
    updatedUser = await User.findByIdAndUpdate( userId, { 
        $pull: { audioFiles: { _id: payload._id } } 
    }, { new: true });
    return updatedUser;
}

const remove = async (userId) => {
    const { error } = ValidationSchemas.removeSchema.validate({ userId });
    if (error) {
        throw error;
    }
    const user = await User.findOneAndRemove({ _id: userId }, { useFindAndModify: false });
    if (!user) {
        throw Boom.notFound('User does not exist');
    }
    response = {
        isRemoved: true,
        message: user.name + " succesfully removed."    
    } 
    return response;
}

module.exports = { getAll, getUser, loginUserWithEmail, loginUserWithUsername, createUser, resetPassword, update, addAudioFile, removeAudioFile, addSummaryFile, removeSummaryFile, remove }