import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const questionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  questions: {
    type: [],
    required: true,
  },
});

const quizSchema = new Schema({
  courseCode: {
    type: String,
    unique: true,
    required: true,
  },
  courseId: {
    type: String,
    unique: true,
    required: true,
  },
  questions: [questionSchema],
});

export default mongoose.model("Quiz", quizSchema);
