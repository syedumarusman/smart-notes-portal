const { Schema } = require('mongoose');

const mongoose =  require('./db');

const FileSchema = new Schema({
    gcs_uri: { type: String, required: true },
    description: { type: String, required: true },
    created: { type: String, required: true }
})

const UserSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    audioFiles: [FileSchema],
    summaryFiles: [FileSchema]
}, {
        collection: 'user', versionKey: false
});

const User = mongoose.model('User', UserSchema);

module.exports = { User, FileSchema };