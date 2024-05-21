const { AdminsDB, StudentsDB, CoursesDB, LecturersDB, ClassesDB } = require('../../utils/global/db.utils');
const main = require('../../utils/global/schedule.map.utils');
const { getStudentsDataByOffset } = require('./admin.users');
const { logError, getSystemDate } = require('./admin.utils');


const generateClassId = (groupId, session) => {
    return `${groupId.slice(0, 3)}-${groupId.slice(4)}_${session[0].toUpperCase()}`;
};


const getRegisteredCourses = (groupId) => {
    const registeredCoursesObjectMap = {
        '400_BCE': ["ENCE 131","ENGE 235","ENTE 341","ENEE 311","CS 131","IT 235","SCTE 341"],
        '400_BTE': ["ENCE 131","ENGE 235","ENTE 341","ENEE 311","CS 131","IT 235","SCTE 341", "ENTE 421", "ENCE 311"],
        '400_BCS': ["ENCE 131","ENGE 235","ENTE 341","CS 121","IT 235","CS 421","CS 101","SCCS 341","CS 311"],
        '300_BCE': ["ENCE 131","ENGE 235","IT 235","CS 421","CS 101","SCCS 341","CS 311"],
        '300_BTE': ["ENCE 121","ENCE 131","ENGE 235","ENTE 421","ENTE 101","ENTE 341","ENEE 311","ENCE 311","CS 121","CS 131","IT 235"],
        '300_BCS': ["ENGE 235","ENTE 421","ENTE 101","ENTE 341","ENEE 311","ENCE 311","CS 121","CS 131","IT 235"],
        '200_BCE': ["ENCE 121","ENCE 131","ENGE 235","ENTE 421","ENTE 101","ENTE 341","ENEE 311","ENCE 311","CS 121","CS 131","IT 235"],
        '200_BTE': ["ENCE 121","ENCE 131","ENGE 235","ENTE 101","ENTE 341","ENEE 311","ENCE 311","CS 121","CS 131","IT 235"],
        '200_BCS': ["ENCE 121","ENCE 131","ENGE 235","ENTE 421","ENTE 101","ENTE 341","ENEE 311","ENCE 311","CS 121","CS 131","IT 235"],
        '100_BCE': ["ENCE 121","ENCE 131","ENGE 235","ENEE 311","ENCE 311","CS 121","CS 131","IT 235"],
        '100_BTE': ["ENCE 121","ENCE 131","ENGE 235","ENTE 421","ENTE 101","ENTE 341","ENEE 311","ENCE 311","CS 121"],
        '100_BCS': ["ENCE 131","ENGE 235","ENTE 421","ENTE 101","ENTE 341","ENEE 311","ENCE 311","CS 121","CS 131","IT 235"],
    }

    return registeredCoursesObjectMap[groupId];
}

async function createClassrooms() {
    const Student = StudentsDB();
    const Classroom = ClassesDB();

    try {
        //flush existing classrooms (delete all)
        await Classroom.deleteMany({});
        const studentsByCourses = await Student.aggregate([
            {
                $group: {
                    _id: {
                        registeredCourses: '$registeredCourses',
                        session: '$session'
                    },
                    students: { $push: '$studentId' },
                    faculty: { $first: '$faculty' }
                }
            }
        ]);

        for (const group of studentsByCourses) {
            const classId = generateClassId(group._id.registeredCourses, group._id.session);
            const createdAt = getSystemDate();
            const classroom = new Classroom({
                classId: classId,
                students: group.students,
                faculty: group.faculty,
                session: group._id.session,
                courses: [...getRegisteredCourses(group._id.registeredCourses)],
                'created-at': createdAt
            });
            await classroom.save();

            await Student.updateMany(
                { studentId: { $in: group.students } },
                { classId: classId }
            );
        }

        await main()

        return 0
    }
    catch (e) {
        if (e) {
            logError(e)
        }
        return -1;
    }

}

module.exports.runCreateClasses = (req, res) => {
    const { adminData } = req;
    const classes = ClassesDB();

    classes.find()
        .then(async (classes) => {
            const exitStatusOfFunction = await createClassrooms();
            if (exitStatusOfFunction == 0) {
                res.redirect(`/admins/render/classrooms/${adminData.id}`);
            }

            else {
                res.render('global/error', { error: "Failed to get classes", status: 500 })
            }
        })
        .catch((error) => {
            if (error) {
                logError(error)
            }
            res.render('global/error', { error: "Failed to get classes", status: 500 })
        })
}