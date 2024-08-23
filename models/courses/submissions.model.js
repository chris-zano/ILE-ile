import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const studentSubmissionSchema = new Schema(
    {
        id: String,//the field ( _id ) of the student document
        subId: String, //the field ( _id ) of the lecturer submission document
        studentId: String, // the field ( studentId ) of the student document
        filename: String, // the original name of the file submitted [ 001_BTE_Morning.pdf]
        fileUrl: String, // the route on which the file is mounted
        date: Object,
        status: {
            type: String,
            enum: ['accepted', 'rejected', 'pending']
        }
    }
);

const lecturerSubmissionSchema = new Schema(
    {
        title: String,
        instructions: String,
        startDate: Object,
        endDate: Object,
        expected: String,
        received: String,
        fileUrl: Object
    }
)
const submissionsSchema = new Schema(
    {
        courseCode: {
            type: String,// the field ( courseCode ) of the course document
            required: true,
            unique: true,
            index: true
        },
        courseName: { type: String, required: true },
        lecturer: {
            type: String, //the field ( _id ) of the lecturer document
            required: true
        },
        lecturerSubmission: {
            type: [lecturerSubmissionSchema],
            required: true,
        },
        studentSubmissions: {
            type: [studentSubmissionSchema],
            default: [],
        },
        status: String
    },
    { timestamps: true }
)
submissionsSchema.index({ courseCode: 1, lecturer: 1 }, { unique: true });

export default mongoose.model('Submissions', submissionsSchema);