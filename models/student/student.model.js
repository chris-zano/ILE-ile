const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * studentId
 * firstName
 * lastName
 * program
 * currentLevel
 * registeredCourses
 * uploadedFiles
 * codeRepos
 */

const createdAtSchema = new Schema({
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
});

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
    'created-at': {
        type: createdAtSchema,
        required: true
    },
    classId: {
        type: String,
        default: "unset"
    }
});

module.exports = mongoose.model('Students', studentSchema);