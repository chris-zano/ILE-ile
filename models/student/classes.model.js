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


const classesSchema = new Schema({
    classId: {
        type: String,
        required: true,
        index:true,
        unique: true,
        match: /^\d{3}-[A-Za-z]*-[A-Z]_[ME]$/
    },
    students: {
        type: Array,
        default: []
    },
    schedule: {
        type: Array,
        default: []
    },
    'created-at': {
        type: createdAtSchema,
        required: true
    }
})

module.exports = mongoose.model('Classes', classesSchema);