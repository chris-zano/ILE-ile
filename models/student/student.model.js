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
    currentLevel: {
        type: Number,
        required: true
    },
    courses: {
        type: Array,
        required: true
    },
    files: {
        type: Array,
        required: true
    },
    repos: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('Students', studentSchema);