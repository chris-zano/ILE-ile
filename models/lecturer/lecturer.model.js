const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const lecturerSchema = new Schema({
    lecturerId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    department: {
        type: Object,
        required: true        
    },
    assignedCourses: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('Lecturers', lecturerSchema);