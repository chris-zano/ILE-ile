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


const classesSchema = new Schema({
    classId: {
        type: String,
        required: true,
        index:true,
        unique: true,
        match: /^\d{3}-[A-Za-z]*_[MEW]$/
    },
    students: {
        type: Array,
        default: []
    },
    schedule: {
        type: Array,
        default: []
    },
    faculty: {
        type: String,
        default: "",
        required: true
    },
    courses: {
        type: Array,
        default: []
    },
    session: {
        type: String,
        required: true
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

module.exports = mongoose.model('Classes', classesSchema);