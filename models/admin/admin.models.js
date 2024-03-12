/**
 * TODO:
 * 
 * create adminAuth class
 * 
 * constructor(username, password)
 * the following methods
 * 1. createNewAdmin(this, firstname, lastname, email, phoneNumber)
 * 2. static deleteAdmin(adminID)
 * 3. static changeAdminPassword(adminID)
 * 4. static changeAdminUsername(adminID)
 * 5. static suspendAdmin(adminID)
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    }
});

module.exports = mongoose.model('Admins', adminSchema);