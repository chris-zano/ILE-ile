const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const fileSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    originalname: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    owner: {
        type: ObjectId,
        required: true
    },
    'created-at': {
        type: Date,
        required: true
    }
});

module.exports =  mongoose.model('Files', fileSchema);