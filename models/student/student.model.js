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
    year: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        default: 'pa55@gctu'
    },
    faculty: {
        type: String,
        required: true
    },
    courses: {
        type: Array,
    },
    files: {
        type: Array
    },
    repos: {
        type: Array
    }
});

module.exports = mongoose.model('Students', studentSchema);