import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const quizSchema = new Schema({
  courseCode: {
    type: String,
    required: true,
  },
  title: {type:String, required: true},
  start: {type:String, required: true},
  end: {type:String, required: true},
  duration: {type:String, required: true},
  questions:Array,
});

export default mongoose.model("Quiz", quizSchema);
