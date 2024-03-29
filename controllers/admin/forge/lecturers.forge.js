const Lecturers = require('../../../models/lecturer/lecturer.model');
const Courses = require('../../../models/courses/courses.model');
const lecturersProperties = ['faculty', 'courseCode', '_id'];


// const courseh = new Courses({
//     courseCode: "CS 135",
//     title: 'Computation Theory',
//     year: "2023/2024",
//     level: 200,
//     semester: 2,
//     department: "FoCIS"
// });

// courseh.save();

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

// const findOne = (query = {}) => {
//     if (!validateQuery(query)) {
//         //TODO: handle when query is invalid
//         return;
//     }

//     Lecturers.findOne(query)
//         .then((doc) => {
//             if (doc == null) {
//                 //TODO: handle when null
//                 return;
//             }

//             return doc;
//         }).catch((error) => {
//             console.error('Error fetching lecturer.findOne: ', error);
//         });
// }

// const findMany = async (query, offset = 0) => {
//     if (!validateQuery(query)) {
//         //TODO: Handle when query is invalid
//     }

//     try {
//         const docs = await Lecturers.find(query)
//             .skip(offset)
//             .limit(100)
//             .exec();

//         const isEndOfData = docs.length < 100;

//         return {
//             docs,
//             cursor: isEndOfData ? 'End' : offset + docs.length
//         };
//     }
//     catch (error) {
//         //TODO: Handle error
//         console.error("Error fetching lecturers.findMany: ", error);
//         return {
//             docs: [],
//             status: 500,
//             cursor: offset
//         }
//     }
// }

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
     * /forge/lecturers/:prop(users, courses)/:action(find, update)/:_id(ObjectId of lecturer)
     * ?id=id&adminId=adminId&role=role
     * 
     * req.body on (prop = users & action = update) {faculty, v}
     * req.body on (prop = courses & action = update) {courseCode, v}
     * 
     */

    const { prop, action, _id } = req.params;
    const { id, adminId, role } = req.query;

    if (prop === "users" && action === "update") {
        const { faculty, v } = req.body;
        updateOne({ _id: _id }, { faculty, v })
            .then((r) => {
                console.log(r);
            }).catch(error => {
                console.log("Error from updateOne: ");
                console.log(error);
            });

        // if (updateUser)
    } else if (prop === "courses" && action === "update") {
        const { courseCode, v } = req.body;

        updateAssignedCourses(_id, "add", courseCode, v)
            .then((r) => {
                console.log('Success: ', r);
            }).catch((error) => {
                console.log("Failed to update assigned courses");
                console.log(error);
            })
    }

    res.end("here")
}

module.exports = forgeLecturerRoutes;