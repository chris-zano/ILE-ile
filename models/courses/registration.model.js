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
    courses: [{
        type: String,
        set: (courses) => {
            // Ensure the courses array contains only unique elements
            return [...new Set(courses)];
        }
    }]
}, { timestamps: true });

registrationSchema.virtual('courseDetails', {
    ref: 'Courses',
    localField: 'courses',
    foreignField: 'courseCode',
    justOne: false
});

registrationSchema.set('toObject', { virtuals: true });
registrationSchema.set('toJSON', { virtuals: true });

export default mongoose.model("Registration", registrationSchema);