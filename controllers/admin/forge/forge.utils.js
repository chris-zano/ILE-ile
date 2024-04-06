const Admins = require('../../../models/admin/admin.models');
const Lecturers = require('../../../models/lecturer/lecturer.model');
const Courses = require('../../../models/courses/courses.model');

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

exports.validateQuery = (query = {}) => {
    if (Object.keys(query).length === 0) {
        //TODO: Handle when empty
        console.error("Invalid Object: [empty]");
        return false;
    }

    console.log("valid object");
    return true;
};

exports.validateHeaderInfo = async (headerInfo) => {
    if (!validateQuery(headerInfo)) {
        logError(TypeError);
    }

    const doc = await Admins.find({ _id: headerInfo['admin-uid'], adminId: headerInfo['admin-id'], role: headerInfo['admin-role'] });

    if (doc == null) {
        // TODO: log request
        console.log("No such Admin");
        return false;
    }

    return true;
}

exports.findMany = async (key = null, value = null, offset = 0, db) => {
    const query = key != null || value != null ? { [key]: value } : {};

    try {
        const docs = await db.find(query)
            .skip(offset)
            .limit(100)
            .exec();

        const isEndOfData = docs.length < 100;

        return {
            docs,
            cursor: isEndOfData ? 'End' : offset + docs.length
        };
    }
    catch (error) {
        //TODO: Handle error
        console.error("Error fetching.(findMany): ", error);
        return {
            docs: [],
            status: 500,
            cursor: offset
        }
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

exports.isValidCourseCode = async (courseCode) => {
    return new Promise((resolve, reject) => {
        Courses.findOne({ courseCode: courseCode })
            .then((course) => {
                if (course == null) reject({
                    message: "No match for course with course-code: " + courseCode,
                    doc: {},
                    state: false
                });
                else {
                    resolve({
                        message: "course-code matches",
                        doc: { faculty: course.faculty },
                        state: true
                    });
                }

            })
            .catch((error) => {
                console.log(error);
                reject({
                    message: "failed to validiate course: " + courseCode,
                    doc: {},
                    state: false
                });
            });
    })

}

exports.render = (res, interface = 'default', headerInfo, stylesheets = [], options = {}) => {

    Admins.findOne({ _id: headerInfo.id, adminId: headerInfo.adminId, role: headerInfo.role})
    then((doc) => {

        if (doc == null) {
            res.render('global/error', { error: 'Unauthorised access' });
            return;
        }

        const dashboardData = {
            pageTitle: `Forge: ${interface.toLowerCase()}`,
            stylesheets: stylesheets,
            utilityScripts: ['/script/utils/admin/util.restful'],
            headerUrl: 'global/header-admin',
            bodyUrl: 'admin/main',
            adminId: doc.adminId,
            _id: doc._id,
            role: doc.role,
            adminObject: doc,
        };


        res.render('index', { ...dashboardData, faculty: doc.faculty, render: interface, options: options });

    }).catch((error) => {
        this.logError(error);

        res.render('global/error', { error: "Internal Server Error" })
    })
}