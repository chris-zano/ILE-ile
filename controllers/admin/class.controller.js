import { StudentsDB, ClassesDB, CoursesDB } from '../../utils/global/db.utils.js';
import main from '../../utils/global/schedule.map.utils.js';
import { logError, getSystemDate } from './admin.utils.js';
const Courses = CoursesDB();
const Students = StudentsDB();
const Classes = ClassesDB();

const generateClassId = (groupId, session) => {
    return `${groupId.slice(0, 3)}-${groupId.slice(4)}_${session[0].toUpperCase()}`;
};


const getRegisteredCourses = async (groupId) => {
    try {
        if (typeof groupId !== 'string') {
            throw new Error('groupId must be a string');
        }

        const groupIdString = groupId.toString();

        // Split the string using '_' as the separator
        const [year, program] = groupIdString.split('_');
        const programs = { 'BCE': "BSc. Computer Engineering", 'BTE': "BSc. Telecom Engineering" };

        if (!(programs[program])) {
            throw new Error('Invalid Program');
        }

        console.log({year, program})
        console.log({programcounter: programs[program]})
        const doc = await Courses.find({ level: year, program: programs[program] }, { courseCode: 1, _id: 0 });
        console.log(doc);
        const courses = [];
        doc.forEach((course) => courses.push(course.courseCode));

        console.log(courses)
        return courses;
    } catch (error) {
        console.log(error);
        console.log(`No courses for ${groupId}`)
        return [];
    }
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
            console.log(classId)
            const courses = await getRegisteredCourses(group._id.registeredCourses);

            if (courses.length === 0) {
                continue;
            }

            const classroom = new Classes({
                classId: classId,
                students: group.students,
                faculty: group.faculty,
                session: group._id.session,
                courses: courses
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

export const runCreateClasses = async (req, res) => {
    const { adminData } = req;

    try {
        console.log("hello - 1")
        const exitStatusOfFunction = await createClassrooms();
        console.log("hello - 2")
        if (exitStatusOfFunction == 0) {
            console.log("hello - 3")
            res.status(200).redirect(`/admins/render/classrooms/${adminData.id}`);
        }
        
        else {
            console.log("hello - 4")
            res.status(404).redirect(`/admins/render/classrooms/${adminData.id}`);
        }
    } catch (error) {
        logError(error)
        res.render('global/error', { error: "Failed to get classes", status: 500 })

    }
}