import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const dateSchema = new Schema(
    {
        day: {
            type: String,
            default: ""
        },
        date: {
            type: String,
            default: ""
        },
        month: {
            type: String,
            default: ""
        },
        year: {
            type: String,
            default: ""
        },
        timeStamp: Number
    },
    { _id: false }
)

const studentSubmissionSchema = new Schema(
    {
        id: String,//the field ( _id ) of the student document
        studentId: String, // the field ( studentId ) of the student document
        filename: String, // the original name of the file submitted [ 001_BTE_Morning.pdf]
        filetype: String, //the type of file (code, pdf, doc, ppt, docx, pptx, excel, etc)
        fileUrl: String, // the route on which the file is mounted
        date: { type: dateSchema },
        status: {
            type: String,
            enum: ['accepted', 'rejected']
        }
    }
);

const lecturerSubmissionSchema = new Schema(
    {
        title: String,
        instructions: String,
        startDate: dateSchema,
        endDate: dateSchema,
        expected: Number,
        received: Number,
        fileUrl:String
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
        lecturer: {
            type: String, //the field ( _id ) of the lecturer document
            unique: true,
            index: true,
            required: true
        },
        lecturerSubmission: {
            type: [lecturerSubmissionSchema],
            required: true,
        },
        studentSubmissions: {
            type: [studentSubmissionSchema],
            default: [],
        }
    },
    { timestamps: true }
)

export default mongoose.model('Submissions', submissionsSchema);