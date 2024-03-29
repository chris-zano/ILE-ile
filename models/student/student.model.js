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
const studentSchema = new Schema({
    studentId: {
        type: String,
        required: true
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
    files: {
        type: Array,
        default: []
    },
    repos: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('Students', studentSchema);