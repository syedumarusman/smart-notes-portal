const Boom = require('boom');
const User = require('../models/user');
const { getNewToken } = require('../utils/jwtService');
const { JWT_SECRET_KEY } = require('../utils/constants');
const ValidationSchemas = require('../validations/userSchema');
const sendEmail = require('../utils/email');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
var FormData = require('form-data');
const { HTTP } = require('../utils/http-service');


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
    const updatedUser = await User.findOneAndUpdate(payload, {$set: {password: newPassword} }, 
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

const addAudioLink = async (payload) => {
    const { error } = ValidationSchemas.addAudioLinkSchema.validate(payload);
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

const generateManuscript = async (payload) => {
    const { error } = ValidationSchemas.manuscriptSchema.validate(payload);
    if (error) {
        throw error;
    }
    // upload file on cloud and get speech to text results
    const filePath = path.join(__dirname, `../assets/audio_files/${payload.file.filename}`);
    console.log("inside generate manuscript", payload)
    try{
        let formData = new FormData();
        formData.append("file", fs.createReadStream(filePath));
        const manuscript = await HTTP.post("/transcribe/", {
            headers: {
            "Content-Type": "multipart/form-data",
            formData: formData
        },
        }).catch((err) => {
            console.log("err:", err)
        });

    } catch (err) {
        console.log(err)
    }



    // Instantiate a storage client
    // const storage = new Storage({ keyFilename:  path.join(__dirname, "../../auth.json")});    

    // store link in db

    // delete file from server
    
    fs.unlinkSync(filePath)

    // return payload
}

module.exports = { getAll, getUser, loginUserWithEmail, loginUserWithUsername, createUser, resetPassword, update, addAudioLink, remove, generateManuscript }