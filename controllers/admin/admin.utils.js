const { MongooseError } = require('mongoose');
const Admins = require('../../models/admin/admin.models');
const Courses = require('../../models/courses/courses.model');
const Students = require('../../models/student/student.model');
const Lecturers = require('../../models/lecturer/lecturer.model');

const utils = require('./admin.utils');
const path = require('path');
const fs = require('fs');


exports.logError = (error) => {
    if (error instanceof MongooseError) {
        const eMes = new MongooseError("Mongoose encountered an error");
        console.error(eMes.stack);
    }
    else if (error instanceof ReferenceError) {
        const eMes = new ReferenceError("Error retrieving lecturer")
        console.error(eMes.stack);
    }
    else if (error instanceof SyntaxError) {
        const eMes = new SyntaxError("Error retrieving lecturer");
        console.error(eMes.stack);
    }
    else if (error instanceof TypeError) {
        const eMes = new TypeError("Error validating instance");
        console.error(eMes.stack);
    }
    else {
        console.log("An error occured: ", error);
    }
    return 0;
};

exports.validateAuthId = async (id) => {
    Admins.findById(id)
        .then((admin) => {
            if (admin == null) {
                utils.logError(new ReferenceError());
                res.render('global/error', { message: "Unauthorised access", status: 403 });
                return {
                    message: "An error occured",
                    admin: {},
                    status: 500
                }
            }
            else {
                const adminData = {
                    id: admin._id,
                    firstname: admin.firstname,
                    lastname: admin.lastname,
                    faculty: admin.faculty
                }
                return {
                    message: "success",
                    admin: adminData,
                    status: 200
                }
            }
        }).catch((error) => {
            utils.logError(error);
            return {
                message: "An error occured",
                admin: {},
                status: 500
            }
        });
}

exports.logSession = (username, ip, status="") => {
    try {
        const logFilePath = path.join(__dirname, '..', '..','logs', 'session.log');
        const timestamp = new Date().toISOString();
        const sessionLog = `${status.toUpperCase()}//:: ${timestamp}: Username: ${username}, IP: ${ip}\n`;
        
        fs.appendFileSync(logFilePath, sessionLog);
        
        console.log('Session logged successfully.'); 
    } catch (error) {
        console.error('Error logging session:', error);
    }
}

exports.getCourses = async (coursesArray = []) => {
    const courses = [];
    const courseObj = {
        title: '',
        courseCode: '',
        faculty: '',
        level: '',
        semester: '',
        year: '',
        students: '',
        resources: '',
        recordings: '',
        schedule: ''
    }
    if (coursesArray.length != 0) {
        let i = 0;
        for (i; i < coursesArray.length; ++i) {
            const course = await Courses.findOne({ courseCode: coursesArray[i] });
            if (course != null) {
                courseObj.title = course.title;
                courseObj.courseCode = course.courseCode;
                courseObj.faculty = course.faculty;
                courseObj.level = course.level;
                courseObj.semester = course.semester;
                courseObj.year = course.year;
                courseObj.students = course.students.length;
                courseObj.resources = course.resources.length;
                courseObj.recordings = course.recordings.length;
                courseObj.schedule = course.schedule;

                courses.push(courseObj)
            }
        }
        if (i == coursesArray.length) {
            return courses
        }
    }else {
        return courses;
    }
}