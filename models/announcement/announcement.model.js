import mongoose from "mongoose";
const Schema = mongoose.Schema;

const announcementSchema = new Schema({

    title: String,
    date: String,
    greetings: String,
    content: String,
    closing: String,
    userName: String,
    to: {
        type: String,
        enum: ["all", "students", "tutors"]
    },
    files: []
});

export default mongoose.model('Announcements', announcementSchema);
