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

const scheduleSchema = new Schema({
    day: {
        type: String
    },
    time: {
        type: String
    }
})

const courseSchema = new Schema({
    courseCode: {
        type: String,
        required: true,
        index: true,
        unique: true
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
    },
    'created-at': {
        type: createdAtSchema,
        required: true
    }
});

courseSchema.pre('save', function(next) {
    // Check if the 'created-at' field is being modified
    if (this.isModified('created-at')) {
        // If it's being modified, prevent the save operation
        return next(new Error("Cannot update 'created-at' field"));
    }
    // If not being modified, proceed with the save operation
    next();
});

module.exports = mongoose.model('Courses', courseSchema);