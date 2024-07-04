import mongoose from "mongoose";
const Schema = mongoose.Schema;

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
    }
}, {
    timestamps: true
});

export default mongoose.model('Classes', classesSchema);