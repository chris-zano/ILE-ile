import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RTCSchema = new Schema(
    {
        classId: { type: String, required: true, unique: true },
        hostId: { type: String, required: true },
        roomId: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model("RTCModel", RTCSchema);