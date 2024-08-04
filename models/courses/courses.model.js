import mongoose from "mongoose";
const Schema = mongoose.Schema;

const lecturerSchema = new Schema({
    lecturerId: {
        type: String,
        default: "TU-000FoE",
        required: true,
        index: true,
        macth: /^TU-\d{3}[A-Za-z]*$/
    },
    name: {
        type: String,
    }
}, { _id: false });

const dateRecordedSchema = new Schema({
    startTime: {
        type: String,
        default: ""
    },
    endTime: {
        type: String,
        default: ""
    }
}, { _id: false });

const  recordingsSchema = new Schema({
    title: {
        type: String,
        default: ""
    },
    dateRecorded: dateRecordedSchema,
    duration: {
        type: String,
        default: ""
    },
    fileUrl: {
        type: String,
        default: ""
    },
    attendance: []
}, { _id: false });

const submissionSchema = new Schema({
    studentId: {
        type: String,
        default: ""
    },
    fileurl: {
        type: String,
        default: ""
    }
}, { _id: false });

const courseMaterialSchema = new Schema({
    owner: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        default: ""
    },
    filetype: {
        type: String,
        default: "",
        index: true
    },
    url: {
        type: String,
        default: ""
    }
}, { _id: false });

const chapterSchema = new Schema({
    lessons: {
        type: Array,
        default: []
    },
    courseMaterials: [courseMaterialSchema],
    courseLectureRecordings: [recordingsSchema],
    submissions: [submissionSchema],
}, { _id: false });

const courseSchema = new Schema({
    courseCode: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    program: {
        type: String,
        required: true
    },
    lecturer: lecturerSchema,
    students: [String],
    chapters: [chapterSchema],
    schedule: {
        type: String,
        default: ""
    },
    credit: {
        type: String,
        required: true
    },
    meeting_status: {
        type: String,
        default: "not in meeting",
        enum: ["not in meeting", "in meeting"]
    },
    attendance: {
        type: Array,
        default: []
    },
    call_start: {
        type: String,
        default:''
    }
}, {
    timestamps: true
});

export default mongoose.model('Courses', courseSchema);