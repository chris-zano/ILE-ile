const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * courseCode
 * title
 * year
 * level
 * lecturer
 * students
 * resources
 * assignments
 * recordings
 * submissions
 */

const courseSchema = new Schema({
    courseCode: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    lecturer: {
        type: String,
        required: true
    },
    students: {
        type: Array
    },
    resources: {
        type: Array
    },
    assignments: {
        type: Array
    },
    recordings: {
        type: Array
    },
    submissions: {
        type: Array
    },
    schedule: {
        type: Object
    }
});

module.exports = mongoose.model('Courses', courseSchema);