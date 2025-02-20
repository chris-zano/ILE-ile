import mongoose from "mongoose";
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    adminId: {
        type: String,
        required: true,
        index: true,
        unique: true
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
    email: {
        type: String,
        default: '',
        unique: true
    },
    faculty: {
        type: String,
        required: true
    },
    profilePicUrl:{
        type: String,
        default:"/users/admins/get-profile-picture/no-id/0"
    },
}, {
    timestamps: true
});


export default mongoose.model('Admins', adminSchema);