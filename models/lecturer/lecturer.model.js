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

const scheduleSchema = new Schema({
    day: {
        type: String
    },
    time: {
        type: String
    },
    duration: {
        type: String
    },
    courseCode: {
        type: String
    }
}, { _id: false });

const lecturerSchema = new Schema({
    lecturerId: {
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
    faculty: {
        type: Object,
        required: true        
    },
    password: {
        type: String,
        default: 'lect&1@gctu.edu'
    },
    assignedCourses: {
        type: Array,
        default: []
    },
    schedule: {
        type: [scheduleSchema],
        default: []
    },
    profilePicUrl:{
        type: String,
        default:"/users/lecturers/get-profile-picture/no-id"
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

module.exports = mongoose.model('Lecturers', lecturerSchema);