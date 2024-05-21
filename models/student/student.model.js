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

const studentSchema = new Schema({
    studentId: {
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
    program: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    session: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default: 'pa55@gctu'
    },
    courses: {
        type: Array,
        default: []
    },
    registeredCourses: {
        type: String, // Representing the String value for registered courses (eg, 100_BCE)
        default: 0
    },
    files: {
        type: Array,
        default: []
    },
    repos: {
        type: Array,
        default: []
    },
    classId: {
        type: String,
        default: "unset"
    },
    profilePicUrl:{
        type: String,
        default:"/users/students/default-profile-picture"
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
    timestamps: true // Automatically manage createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Students', studentSchema);