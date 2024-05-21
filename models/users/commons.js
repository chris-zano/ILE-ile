const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
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

const CommonsSchema = new Schema({
    userId: {
        type: ObjectId,
        required: true,
        unique: true,
        index: true
    },
    profilePicUrl: {
        type: String,
        default: ""
    },
    fileUrls: {
        type: [String], // Specify that the array contains strings
        default: []
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
    timestamps: true // Automatically manage createdAt and updatedAt timestamps
});

module.exports = mongoose.model("Commons", CommonsSchema);
