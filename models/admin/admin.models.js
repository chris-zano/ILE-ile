const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dateSchema = new Schema({
    day: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    }
}, { _id: false });

const adminSchema = new Schema({
    adminId: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    profilePicUrl:{
        type: String,
        default:"/users/admins/get-profile-picture/no-id"
    },
    createdAt: {
        type: dateSchema,
        required: true,
    },
    updatedAt: {
        type: dateSchema,
        required: true
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('Admins', adminSchema);