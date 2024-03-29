const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/**
 * fileName
 * fileUrl
 * owner - the (studentId / lecturerId )
 * courseId
 * created-at:
 */
const materialSchema = new Schema({
    filename: {
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
        type: Date,
        required: true
    }
});

module.exports =  mongoose.model('Materials', materialSchema);