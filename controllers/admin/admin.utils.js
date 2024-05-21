const { MongooseError } = require('mongoose');
const { AdminsDB, StudentsDB, CoursesDB, LecturersDB } = require('../../utils/global/db.utils');

const utils = require('./admin.utils');
const path = require('path');
const fs = require('fs');


module.exports.logError = (error) => {
    if (error instanceof MongooseError) {
        const eMes = new MongooseError(error.message);
        console.error(eMes.stack);
    }
    else if (error instanceof ReferenceError) {
        const eMes = new ReferenceError(error.message)
        console.error(eMes.stack);
    }
    else if (error instanceof SyntaxError) {
        const eMes = new SyntaxError(error.message);
        console.error(eMes.stack);
    }
    else if (error instanceof TypeError) {
        const eMes = new TypeError(error.message);
        console.error(eMes.stack);
    }
    else {
        console.log("An error occured: ", error);
    }
    return 0;
};

module.exports.validateAuthId = async (id) => {
    AdminsDB().findById(id)
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
                    firstname: admin.firstName,
                    lastname: admin.lastName,
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

module.exports.logSession = (username, ip, status = "") => {

    function addSuperscript(num) {
        const j = num % 10,
            k = num % 100;
        if (j === 1 && k !== 11) {
            return num + "st";
        }
        if (j === 2 && k !== 12) {
            return num + "nd";
        }
        if (j === 3 && k !== 13) {
            return num + "rd";
        }
        return num + "th";
    }

    try {
        const logFilePath = path.join(__dirname, '..', '..', 'logs', 'session.log');

        const datestamp = this.getSystemDate()
        const timestamp = this.getSystemTime()

        const logDate = `${datestamp.day},${addSuperscript(datestamp.date)}-${datestamp.month}-${datestamp.year}`;
        const logTime = `${timestamp.hours}:${timestamp.minutes}:${timestamp.seconds}`;

        const sessionLog = `${status.toUpperCase()}//:: ${logDate} at ${logTime} - Username:{${username}}, IP:= {${ip}}\n`;

        fs.appendFileSync(logFilePath, sessionLog);

        console.log('Session logged successfully.');
    } catch (error) {
        console.error('Error logging session:', error);
    }
}

module.exports.getCourses = async (coursesArray = []) => {
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
            const course = await CoursesDB().findOne({ courseCode: coursesArray[i] });
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
    } else {
        return courses;
    }
}

module.exports.getSystemDate = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date();

    return {
        day: days[date.getDay()],
        date: date.getDate(),
        month: months[date.getMonth()],
        year: date.getFullYear()
    };
}

module.exports.getSystemTime = () => {
    const time = new Date();

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    return {
        hours: hours < 10 ? "0"+ hours: hours,
        minutes: minutes < 10 ? "0"+minutes: minutes,
        seconds: seconds < 10 ? "0"+seconds: seconds
    }
}