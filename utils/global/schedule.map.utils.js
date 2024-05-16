const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/ileSchool");

const { ClassesDB, CoursesDB, LecturersDB } = require('./db.utils');
const Classes = ClassesDB();
const Courses = CoursesDB();
const Lecturers = LecturersDB();

const sortLengthsInAscendingOrder = (lengths = []) => {
    return lengths.sort((a, b) => a.length - b.length);
}

const getClassesByLevel = (level) => {
    return new Promise((resolve, reject) => {
        Classes.find({ classId: { $regex: new RegExp(level, 'i') } })
            .then((classes) => {
                resolve([...classes]);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            })
    })
}

const getLecturersList = async (rooms) => {
    let lecturerList = []
    let lecturerListItem = { lecturerId: "", schedule: [] }
    let lecturerListItemSchedule = { day: "", time: "", duration: "", courseCode: "" };

    for (let room of rooms) {
        if (room.length !== 0) {
            for (let classroom of room) {
                const classregisteredCourses = classroom.courses;
                for (let courseCode of classregisteredCourses) {
                    const course = await Courses.findOne({ courseCode: courseCode });
                    if (course != null) {
                        const lecturerId = course.lecturer.lecturerId;

                        // Check if the lecturer is already in the list
                        const lecturerExists = lecturerList.some(item => item.lecturerId === lecturerId);

                        if (!lecturerExists) {
                            // Create a new lecturerListItem
                            const lecturerListItem = { lecturerId: lecturerId, schedule: [] };
                            lecturerList.push(lecturerListItem);
                        }
                    }
                }
            }
        }
    }
    return lecturerList;
}

const main = async () => {
    const classes_400 = await getClassesByLevel("400-");
    const classes_300 = await getClassesByLevel("300-");
    const classes_200 = await getClassesByLevel("200-");
    const classes_100 = await getClassesByLevel("100-");

    let rooms = sortLengthsInAscendingOrder([classes_400, classes_300, classes_200, classes_100]);
    const lecturersList = await getLecturersList(rooms);
    console.log(lecturersList);

    //use rooms - iterate through each room access schedule and pass to function alog with lecturerList
}

main();