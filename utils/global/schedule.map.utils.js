import { ClassesDB, CoursesDB, LecturersDB } from './db.utils';
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

    for (let room of rooms) {
        if (room.length !== 0) {
            for (let classroom of room) {
                const classregisteredCourses = classroom.courses;
                for (let courseCode of classregisteredCourses) {
                    const course = await Courses.findOne({ courseCode: courseCode });
                    if (course != null) {
                        const lecturerId = course.lecturer.lecturerId;

                        const lecturerExists = lecturerList.some(item => item.lecturerId === lecturerId);

                        if (!lecturerExists) {
                            const lecturerListItem = { lecturerId: lecturerId, schedule: [], classes: [], courses: [{ course: course.courseCode, credit: course.credit }] }
                            lecturerList.push(lecturerListItem);
                        }
                        else {
                            const lecturer = lecturerList.find((item) => item.lecturerId === lecturerId);
                            const arrayOfCourses = [];
                            lecturer.courses.forEach(course => arrayOfCourses.push(course.course))

                            if (!arrayOfCourses.includes(course.courseCode)) {
                                lecturer.courses.push({ course: course.courseCode, credit: course.credit });
                            }
                        }
                    }
                }
            }
        }
    }
    return lecturerList;
}

const parseRoomsIntoClassRoomObjects = (rooms = []) => {
    let arrayOfClassSchedules = [];
    for (let row of rooms) {
        if (row.length !== 0) {
            for (let room of row) {
                arrayOfClassSchedules.push({
                    classId: room.classId,
                    lecturerList: [],
                    courseList: room.courses,
                    schedule: []
                });
            }
        }
    }
    return arrayOfClassSchedules;
}

const filterClasses = (classes = [], filter = "") => {
    return classes.filter((item) => {
        const morningClassregExp = new RegExp(`_${filter}$`, "i");
        return morningClassregExp.test(item.classId);
    });
}

const main = async () => {
    const Classes = ClassesDB();
    const classes_400 = await getClassesByLevel("400-");
    const classes_300 = await getClassesByLevel("300-");
    const classes_200 = await getClassesByLevel("200-");
    const classes_100 = await getClassesByLevel("100-");

    let rooms = sortLengthsInAscendingOrder([classes_400, classes_300, classes_200, classes_100]);
    let lecturersList = await getLecturersList(rooms);
    let classes = parseRoomsIntoClassRoomObjects(rooms);


    for (let lecturer of lecturersList) {
        for (let classroom of classes) {
            for (let course of lecturer.courses) {
                if (classroom.courseList.includes(course.course)) {
                    if (!classroom.lecturerList.includes(lecturer.lecturerId)) {
                        classroom.lecturerList.push(lecturer.lecturerId);
                        classroom.schedule.push({ course: course.course, lecturer: lecturer.lecturerId, day: "", start_time: "", duration: course.credit, credit: course.credit })
                    }
                    if (!lecturer.classes.includes(classroom.classId)) {
                        lecturer.classes.push(classroom.classId)
                    }
                }
            }
        }
    }

    for (let i = 0; i < classes.length; i++) {
        classes[i] = {
            classId: classes[i].classId,
            schedule: classes[i].schedule
        }
    }
    const morningClasses = filterClasses(classes, "M");
    const eveningClasses = filterClasses(classes, "E");
    const weekendClasses = filterClasses(classes, "W");

    const isLecturerAvailable = (lecturer, day, start_time, duration, allSchedules) => {
        const start = parseInt(start_time);
        const end = start + parseInt(duration);

        for (let schedule of allSchedules) {
            if (schedule.day === day && schedule.lecturer === lecturer) {
                const scheduleStart = parseInt(schedule.start_time);
                const scheduleEnd = scheduleStart + parseInt(schedule.duration);

                if ((start >= scheduleStart && start < scheduleEnd) || (end > scheduleStart && end <= scheduleEnd)) {
                    return false;
                }
            }
        }
        return true;
    };

    const assignSchedule = (classes, days, startHour, endHour, maxClassesPerDay, allSchedules) => {
        for (let room of classes) {
            let dayIndex = 0;
            let workingHour;
            if (classes.length === 3 && days[dayIndex] === "Friday") {
                workingHour = 10;
                endHour = 23
            }
            else {
                workingHour = startHour;
            }
            let classesPerDay = 0;

            for (let schedule of room.schedule) {
                while (!isLecturerAvailable(schedule.lecturer, days[dayIndex], workingHour, schedule.duration, allSchedules)) {
                    workingHour += parseInt(schedule.duration) + 1;
                    if (workingHour >= endHour) {
                        classesPerDay = 0;
                        workingHour = startHour;
                        dayIndex++;
                        if (dayIndex >= days.length) {
                            console.log("Not enough days to schedule all classes for", room.classId);
                            break;
                        }
                    }
                }

                if (dayIndex >= days.length) {
                    console.log("Not enough days to schedule all classes for", room.classId);
                    break;
                }

                schedule.day = days[dayIndex];
                schedule.start_time = String(workingHour);

                allSchedules.push({ ...schedule });

                workingHour += parseInt(schedule.duration) + 1;
                classesPerDay++;

                if (classesPerDay >= maxClassesPerDay || workingHour >= endHour) {
                    classesPerDay = 0;
                    workingHour = startHour;
                    dayIndex++;
                }
            }
        }
    };

    const allSchedules = [];
    const maxClassesPerDay = 3;

    assignSchedule(weekendClasses, ['Friday','Saturday', 'Sunday'], 8, 22, maxClassesPerDay, allSchedules);
    assignSchedule(eveningClasses, ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"], 16, 21, maxClassesPerDay, allSchedules);
    assignSchedule(morningClasses, ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], 8, 16, maxClassesPerDay, allSchedules);

    weekendClasses.forEach(clas => {
        Classes.findOneAndUpdate(
            { classId: clas.classId },
            { $set: { schedule: clas.schedule }, $inc: { __v: 1 } },
            { new: true, upsert: true }
        )
        .then((doc) => {
        })
        .catch((error) => {
            console.log("Error occurred => ", error);
        });
    });
    
    eveningClasses.forEach(clas => {
        Classes.findOneAndUpdate(
            { classId: clas.classId },
            { $set: { schedule: clas.schedule }, $inc: { __v: 1 } },
            { new: true, upsert: true }
        )
        .then((doc) => {
        })
        .catch((error) => {
            console.log("Error occurred => ", error);
        });
    });
    
    morningClasses.forEach(clas => {
        Classes.findOneAndUpdate(
            { classId: clas.classId },
            { $set: { schedule: clas.schedule }, $inc: { __v: 1 } },
            { new: true, upsert: true }
        )
        .then((doc) => {
        })
        .catch((error) => {
            console.log("Error occurred => ", error);
        });
    });

    return;
}

export default main;