import {  StudentsDB , ClassesDB } from '../../utils/global/db.utils.js';
import main from '../../utils/global/schedule.map.utils.js';
import { logError, getSystemDate } from './admin.utils.js';

const Students = StudentsDB();
const Classes = ClassesDB();

const generateClassId = (groupId, session) => {
    return `${groupId.slice(0, 3)}-${groupId.slice(4)}_${session[0].toUpperCase()}`;
};


const getRegisteredCourses = (groupId) => {
    const registeredCoursesObjectMap = {
        '400_BCE': ["ENCE 131", "ENGE 235", "ENTE 341", "ENEE 311", "CS 131", "IT 235", "SCTE 341"],
        '400_BTE': ["ENCE 131", "ENGE 235", "ENTE 341", "ENEE 311", "CS 131", "IT 235", "SCTE 341", "ENTE 421", "ENCE 311"],
        '400_BCS': ["ENCE 131", "ENGE 235", "ENTE 341", "CS 121", "IT 235", "CS 421", "CS 101", "SCCS 341", "CS 311"],
        '300_BCE': ["ENCE 131", "ENGE 235", "IT 235", "CS 421", "CS 101", "SCCS 341", "CS 311"],
        '300_BTE': ["ENCE 121", "ENCE 131", "ENGE 235", "ENTE 421", "ENTE 101", "ENTE 341", "ENEE 311", "ENCE 311", "CS 121", "CS 131", "IT 235"],
        '300_BCS': ["ENGE 235", "ENTE 421", "ENTE 101", "ENTE 341", "ENEE 311", "ENCE 311", "CS 121", "CS 131", "IT 235"],
        '200_BCE': ["ENCE 121", "ENCE 131", "ENGE 235", "ENTE 421", "ENTE 101", "ENTE 341", "ENEE 311", "ENCE 311", "CS 121", "CS 131", "IT 235"],
        '200_BTE': ["ENCE 121", "ENCE 131", "ENGE 235", "ENTE 101", "ENTE 341", "ENEE 311", "ENCE 311", "CS 121", "CS 131", "IT 235"],
        '200_BCS': ["ENCE 121", "ENCE 131", "ENGE 235", "ENTE 421", "ENTE 101", "ENTE 341", "ENEE 311", "ENCE 311", "CS 121", "CS 131", "IT 235"],
        '100_BCE': ["ENCE 121", "ENCE 131", "ENGE 235", "ENEE 311", "ENCE 311", "CS 121", "CS 131", "IT 235"],
        '100_BTE': ["ENCE 121", "ENCE 131", "ENGE 235", "ENTE 421", "ENTE 101", "ENTE 341", "ENEE 311", "ENCE 311", "CS 121"],
        '100_BCS': ["ENCE 131", "ENGE 235", "ENTE 421", "ENTE 101", "ENTE 341", "ENEE 311", "ENCE 311", "CS 121", "CS 131", "IT 235"],
    }

    return registeredCoursesObjectMap[groupId];
}

async function createClassrooms() {

    try {
        //flush existing classrooms (delete all)
        await Classes.deleteMany({});
        const studentsByCourses = await Students.aggregate([
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
            const classroom = new Classes({
                classId: classId,
                students: group.students,
                faculty: group.faculty,
                session: group._id.session,
                courses: [...getRegisteredCourses(group._id.registeredCourses)]
            });
            await classroom.save();

            await Students.updateMany(
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

export const runCreateClasses = (req, res) => {
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