const { ObjectId } = require('mongodb');
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

const materialSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    originalname: {
        type: String,
        required: true
    },
    fileurl: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    courseId: {
        type: ObjectId,
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

module.exports =  mongoose.model('Materials', materialSchema);