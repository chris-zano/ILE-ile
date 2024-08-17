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
    email: {
        type: String,
        default: '',
        unique: true
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
        type: [String],
        default:[],
        set: (courses) => {
            return [...new Set(courses)];
        }
    },
    registeredCourses: { //eg 100_BCE, 200_BTE...
        type: String,
        default: "100_BCE",
        // enum: ["100_BCE", "100_BTE", "200_BCE", "200_BTE", "300_BCE", "300_BTE", "400_BCE", "400_BTE"]
    },
    files: { //array of objects
        type: Array,
        default: []
    },
    repos: { //array of objects
        type: Array,
        default: []
    },
    classId: {
        type: String,
        default: "unset"
    },
    profilePicUrl: {
        type: String,
        default: "/users/students/get-profile-picture/no-id/0"
    }
}, {
    timestamps: true
});

export default mongoose.model('Students', studentSchema);