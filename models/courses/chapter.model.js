// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const createdAtSchema = new Schema({
//     day: {
//         type: String,
//         required: true
//     },
//     date: {
//         type: String,
//         required: true
//     },
//     month: {
//         type: String,
//         required: true
//     },
//     year: {
//         type: String,
//         required: true
//     }
// });

// const dateRecordedSchema = new Schema({
//     day: {
//         type: String,
//         default: ""
//     },
//     date: {
//         type: String,
//         default: ""
//     },
//     month: {
//         type: String,
//         default: ""
//     },
//     year: {
//         type: String,
//         default: ""
//     },
//     startTime: {
//         type: String,
//         default: ""
//     },
//     endTime: {
//         type: String,
//         default: ""
//     }
// });

// const durationSchema = new Schema({
//     hours: {
//         type: String,
//         default: ""
//     },
//     minutes: {
//         type: String,
//         default: ""
//     },
//     seconds: {
//         type: String,
//         default: ""
//     }
// });

// const attendeesSchema = new Schema({
//     studentId: {
//         type: String,
//         default: ""
//     },
//     name: {
//         type: String,
//         default: ""
//     },
//     joined: {
//         type: String,
//         default: ""
//     },
//     left: {
//         type: String,
//         default: ""
//     }
// })

// const attendanceSchema = new Schema({
//     count: {
//         type: Number,
//         default: 0
//     },
//     expected: {
//         type: Number,
//         default: 0
//     },
//     attendees: [attendeesSchema],
//     absentees: [attendeesSchema]
// });

// const recordingsSchema =  new Schema({
//     title: {
//         type: String,
//         default: ""
//     },
//     dateRecorded: dateRecordedSchema,
//     duration: durationSchema,
//     fileUrl: {
//         type: String,
//         default: ""
//     },
//     attendance: attendanceSchema
// });

// const submissionSchema = new Schema({
//     studentId: {
//         type: String,
//         default: ""
//     },
//     fileurl: {
//         type: String,
//         default: ""
//     }
// });

// const courseMaterialSchema = new Schema({
//     title: {
//         type: String,
//         default: ""
//     },
//     filetype: {
//         type: String,
//         default: "",
//         index: true
//     },
//     url: {
//         type: String,
//         default: ""
//     }
// });

// const chapterSchema = new Schema({
//     lessons: {
//         type: Array,
//         default: []
//     },
//     courseMaterials: [courseMaterialSchema],
//     courseLectureRecordings: [recordingsSchema],
//     submissions: [submissionSchema],
//     'created-at': {
//         type: createdAtSchema,
//         required: false
//     }
// });

// chapterSchema.pre('save', function(next) {
//     if (this.isModified('created-at')) {
//         return next(new Error("Cannot update 'created-at' field"));
//     }
//     next();
// });
