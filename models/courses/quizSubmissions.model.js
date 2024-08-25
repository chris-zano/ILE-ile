import mongoose from "mongoose";

const Schema = mongoose.Schema;

const quizSubmissionSchema = new Schema({
    courseCode: {type: String, required: true},
    quiz_id: { type: String, required: true },
    student_id: { type: String, required: true },
    responses: { type: Array, required: true },
    score: { type: Number, required: true }
});

quizSubmissionSchema.index({quiz_id: 1, student_id:1}, {unique: true})

export default mongoose.model("QuizSubmissions", quizSubmissionSchema);