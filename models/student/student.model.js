import mongoose from "mongoose";
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    studentId: {
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
    program: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    session: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default: 'pa55@gctu'
    },
    courses: {
        type: Array,
        default: []
    },
    registeredCourses: {
        type: String, // Representing the String value for registered courses (eg, 100_BCE)
        default: 0
    },
    files: {
        type: Array,
        default: []
    },
    repos: {
        type: Array,
        default: []
    },
    classId: {
        type: String,
        default: "unset"
    },
    profilePicUrl:{
        type: String,
        default:"/users/students/get-profile-picture/no-id"
    }
}, {
    timestamps: true
});

export default mongoose.model('Students', studentSchema);