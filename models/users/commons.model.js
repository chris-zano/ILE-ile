import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CommonsSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    profilePicUrl: {
        type: String,
        default: ""
    },
    fileUrls: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

export default mongoose.model("Commons", CommonsSchema);
