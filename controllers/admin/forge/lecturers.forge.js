const Lecturers = require('../../../models/lecturer/lecturer.model');
const Courses = require('../../../models/courses/courses.model');
const { Mongoose, MongooseError } = require('mongoose');
const lecturersProperties = ['faculty', 'courseCode', '_id'];


const logError = (error) => {
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
    else {
        console.log("An error occured: ", error);
    }
    return 0;
}

const validateQuery = (query = {}) => {
    if (Object.keys(query).length === 0) {
        //TODO: Handle when empty
        console.error("Invalid Object: [empty]");
        return false;
    }

    console.log("valid object");
    return true;
}

const isValidCourseCode = async (courseCode) => {
    return new Promise((resolve, reject) => {
        Courses.findOne({ courseCode: courseCode })
            .then((course) => {
                if (course == null) reject({
                    message: "No match for course with course-code: " + courseCode,
                    doc: {},
                    state: false
                });

                resolve({
                    message: "course-code matches",
                    doc: { faculty: course.faculty },
                    state: true
                });
            })
    }).catch((error) => {
        console.log(error);
        reject({
            message: "failed to validiate course: " + courseCode,
            doc: {},
            state: false
        });
    });

}

const getCourses = async (coursesArray = []) => {
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
    }
}


const findOne = async (id = '') => {

    try {
        const tut = await Lecturers.findOne({ _id: id });
        if (tut == null) {
            console.log("No such user");
            return "No such user: " + id;
        }

        const courses = await getCourses(tut.assignedCourses);
        return {
            name: `${tut.firstName} ${tut.lastName}`,
            faculty: `${tut.faculty}`,
            courses: courses,
            state: 200
        }
    }
    catch (error) {
        logError(error);

        return {
            name: null,
            faculty: null,
            courses: null,
            state: 500
        }
    }

}

const findMany = async (query, offset = 0) => {
    if (!validateQuery(query)) {
        //TODO: Handle when query is invalid
        console.log('Invalid query');
        return false;
    }

    try {
        const docs = await Lecturers.find(query)
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
        console.error("Error fetching lecturers.findMany: ", error);
        return {
            docs: [],
            status: 500,
            cursor: offset
        }
    }
}

const updateOne = async (query = {}, updateParams = {}) => {
    if (!validateQuery(query) || !validateQuery(updateParams)) {
        //TODO: Handle if invalid
        return {
            message: `Error [Invalid Query]: ${query} & ${updateParams}`,
            doc: {},
            state: false
        };
    }

    return new Promise((resolve, reject) => {
        Lecturers.findOneAndUpdate(query)
            .then((doc) => {
                if (doc == null) return false;

                if (updateParams.v != doc.__v) {
                    reject({
                        message: 'Inconsistent Data',
                        doc: doc,
                        state: false
                    });
                }
                else {
                    doc.faculty = updateParams.faculty;
                    doc.__v = doc.__v + 1;
                    doc.save();

                    resolve({
                        message: 'success',
                        doc: doc,
                        state: true
                    });
                }

            }).catch((error) => {
                console.error("Error while updating lecturer document: ");
                reject({
                    message: "Internal Server Error",
                    doc: {},
                    state: false
                });
            });
    })

}

const updateAssignedCourses = async (_id, action = 'add', courseCode = '', v = 0) => {
    if (!isValidCourseCode(courseCode)) return false;

    return new Promise((resolve, reject) => {
        Lecturers.findOneAndUpdate({ _id: _id })
            .then((doc) => {
                if (doc == null) reject({
                    message: "Error [no match for lecturer]: " + _id,
                    doc: {},
                    state: false
                });

                if (v != doc.__v) {
                    reject({
                        message: 'Inconsistent Data',
                        doc: doc,
                        state: false
                    });
                }
                else {
                    const courses = doc.assignedCourses;
                    //TODO: check if course exists first
                    if (action == 'add') {
                        courses.push(courseCode);
                    }
                    else if (action == 'delete') {
                        courses.splice(courses.indexOf(courseCode), 1);
                    }
                    else {
                        reject({
                            message: "Invalid action call for: " + action,
                            doc: {},
                            state: false
                        });
                    }

                    doc.__v = doc.__v + 1;
                    doc.save();
                    resolve({
                        message: "success",
                        doc: doc,
                        state: true
                    });
                }

            }).catch((error) => {
                console.log("Error while updating assigned courses: ");
                reject({
                    message: "Error while updating assigned courses:  " + _id + " " + courseCode,
                    doc: {},
                    state: false
                })
            });
    })
}

const forgeLecturerRoutes = (req, res) => {
    /**
     * request pack
     * /forge/lecturers/:prop(users, courses, views)/:action(find, update, render)/:_id(ObjectId of lecturer, offset)
     * header {
     *      admin-uid:_id,
     *      admin-id: adminId,
     *      admin-role: role
     * }
     * 
     * ?key=queryKey&value=queryValue
     * 
     * req.params on (prop = views & action = render) {id, adminId, role}
     * 
     * [done]req.params on (prop = users & action = find) {faculty, v}
     * [done]req.params on (prop = users & action = update) {faculty, v}
     * 
     * req.params on (prop = courses & action = find) {courseCode, v}
     * req.params on (prop = courses & action = update) {courseCode, v}
     * 
     */

    const { prop, action, _id } = req.params;
    const { key, value } = req.query;
    const headerInfo = {
        id: req.headers['admin-uid'],
        adminId: req.headers['admin-id'],
        role: req.headers['admin-role']
    }

    validateHeaderInfo(headerInfo);
    // TODO: validate requests

    if (prop === "users") {
        const { faculty, v } = req.body;
        if (action === "update") {
            updateOne({ _id: _id }, { faculty, v })
                .then((r) => {
                    console.log(r);
                }).catch(error => {
                    console.log("Error from updateOne: ");
                    console.log(error);
                });
        }
        else if (action === "find") {
            findOne(_id)
                .then((tutor) => {
                    res.status(tutor.state).json(tutor);
                }).catch((error) => {
                    res.status(error.state).json(error);
                });
            }
            else {
                console.log("Invalid action: ", action);
                res.status(400).json({
                    message: "Bad Request"
                });
        }

    } else if (prop === "courses") {
         if (action === "update") {
            const { courseCode, v } = req.body;
    
            updateAssignedCourses(_id, "add", courseCode, v)
                .then((r) => {
                    res.status(200).json(r);
                }).catch((error) => {
                    console.log("Failed to update assigned courses");
                    res.status(404).json(error);
                });
        }
        else {
            res.status(400).json({
                message: "Bad Request"
            });
        }
    }
    else if (prop === 'views') {
        if (action === "render") {
            const offset = req.params._id;
            findMany({[key]: value}, offset > 0? offset: 0)
            .then((docs) => {
                console.log(docs);
            })
        }
    }
    res.end("here");
}

module.exports = forgeLecturerRoutes;