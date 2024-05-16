const { AdminsDB, StudentsDB, CoursesDB, LecturersDB, ClassesDB } = require('../../utils/global/db.utils');
const { getStudentsDataByOffset } = require('./admin.users');
const { logError, getSystemDate } = require('./admin.utils');


const generateClassId = (groupId, session) => {
    return `${groupId.slice(0, 3)}-${groupId.slice(4)}_${session[0].toUpperCase()}`;
};


const getRegisteredCourses = (groupId) => {
    const registeredCoursesObjectMap = {
        '400_BCE': ['ENCE 421', 'CS 135'],
        '400_BIT': ['ENCE 421', 'CS 135'],
        '400_BTE': ['ENCE 421', 'CS 135'],
        '300_BCE': ['ENCE 421', 'CS 135'],
        '300_BTE': ['ENCE 421', 'CS 135'],
        '200_BCE': ['ENCE 421', 'CS 135'],
        '200_BTE': ['ENCE 421', 'CS 135'],
        '100_BCE': ['ENCE 421', 'CS 135'],
        '100_BTE': ['ENCE 421', 'CS 135'],
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

        return 0
    }
    catch (e) {
        if (e) {
            logError(e)
        }
        return -1;
    }

}

exports.runCreateClasses = (req, res) => {
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