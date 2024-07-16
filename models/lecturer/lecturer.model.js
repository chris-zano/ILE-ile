import mongoose from "mongoose";
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    day: {
        type: String
    },
    time: {
        type: String
    },
    duration: {
        type: String
    },
    courseCode: {
        type: String
    }
}, { _id: false });

const lecturerSchema = new Schema({
    lecturerId: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    faculty: {
        type: Object,
        required: true        
    },
    password: {
        type: String,
        default: 'lect&1@gctu.edu'
    },
    assignedCourses: {
        type: Array,
        default: []
    },
    schedule: {
        type: [scheduleSchema],
        default: []
    },
    profilePicUrl:{
        type: String,
        default:"/users/lecturers/get-profile-picture/no-id/0"
    }
}, {
    timestamps: true
});

export default mongoose.model('Lecturers', lecturerSchema);