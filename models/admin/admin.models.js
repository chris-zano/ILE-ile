const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const createdAtSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    }
});

const adminSchema = new Schema({
    adminId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    'created-at': {
        type: createdAtSchema,
        required: true
    }
});

adminSchema.pre('save', function(next) {
    // Check if the 'created-at' field is being modified
    if (this.isModified('created-at')) {
        // If it's being modified, prevent the save operation
        return next(new Error("Cannot update 'created-at' field"));
    }
    // If not being modified, proceed with the save operation
    next();
});

module.exports = mongoose.model('Admins', adminSchema);