/**
 * @file registration model
 * @module courseRegistrationSchema
 * 
 * This module exports the mongoose model for the Course registration schema
 */

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const registrationSchema = new Schema({
    registrationCode: {
        type: String,
        unique: true,
        required: true,
    },
    courses: [Array]
}, { timestamps: true });

export default mongoose.model("Registration", registrationSchema);