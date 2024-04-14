const { ObjectId } = require('mongodb');
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
    'created-at': {
        type: createdAtSchema,
        required: true
    }
});

materialSchema.pre('save', function(next) {
    // Check if the 'created-at' field is being modified
    if (this.isModified('created-at')) {
        // If it's being modified, prevent the save operation
        return next(new Error("Cannot update 'created-at' field"));
    }
    // If not being modified, proceed with the save operation
    next();
});

module.exports =  mongoose.model('Materials', materialSchema);