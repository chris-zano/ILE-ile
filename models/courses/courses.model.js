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
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    lecturer: {
        type: String,
        default: ""
    },
    students: {
        type: Array,
        default: []
    },
    resources: {
        type: Array,
        default: []
    },
    assignments: {
        type: Array,
        default: []
    },
    recordings: {
        type: Array,
        default: []
    },
    submissions: {
        type: Array,
        default: []
    },
    schedule: {
        type: Object,
        default: {}
    }
});

module.exports = mongoose.model('Courses', courseSchema);