const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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
    'created-at': {
        type: createdAtSchema,
        required: true
    }
});

module.exports = mongoose.model('Lecturers', lecturerSchema);