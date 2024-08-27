import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['textBooks', 'lecturerSlides', 'assignments', 'lectureRecordings', 'pastQuestions']
    },
    thumbnail: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
