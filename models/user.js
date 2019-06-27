const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tours: {
        type: Array
    },
    verified: {
        type: Boolean,
        default: false
    },
    roles: {
        type: Array,
        'default': ["Ambassador"]
    }
})

const User = mongoose.model('User', UserSchema);
module.exports = User;