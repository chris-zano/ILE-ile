import { ClassesDB, CoursesDB, LecturersDB } from '../../utils/global/db.utils.js';
import { logError } from '../admin/admin.utils.js';
import { getNearestEvents } from '../student/dashboards.helpers.js';
// import { getNearestEvents } from './dashboards.helpers.js';

const Courses = CoursesDB();
const Classes = ClassesDB();
const Lecturers = LecturersDB()

export const getLecturerEvents = async (uid, classId) => {
    try {
        const lecturer = await Lecturers.findOne({ _id: uid }, { assignedCourses: 1, _id: 0 });

        if (!lecturer) {
            throw new Error('Lecturer not found');
        }

        const assignedCourses = lecturer.assignedCourses;

        if (!assignedCourses || assignedCourses.length === 0) {
            return [];
        }

        const schedulesArray = await Classes.find({ courses: { $in: assignedCourses } }, { schedule: 1, _id: 0 });

        const schedules = schedulesArray.flatMap(doc => doc.schedule);

        if (!schedules || schedules.length === 0) {
            return [];
        }

        // Get the nearest events
        const nearestEvents = getNearestEvents(schedules);

        // Fetch course details and update events
        const updatedEvents = await Promise.all(nearestEvents.map(async event => {
            const courseDetails = await Courses.findOne({ courseCode: event.course }, { title: 1, _id: 1 });
            return { ...event, course: courseDetails };
        }));

        return updatedEvents;

    } catch (error) {
        logError(error);
    }
};

export const getLecturerCourses = async (uid) => {
    try {
        const lecturer = await Lecturers.findOne({ _id: uid }, { assignedCourses: 1, _id: 0 });

        if (!lecturer) {
            throw new Error('Lecturer not found');
        }

        const assignedCourses = lecturer.assignedCourses;

        if (!assignedCourses || assignedCourses.length === 0) {
            return [];
        }
        const courseDetails = await Promise.all(assignedCourses.map(async code => {
            const data = await Courses.findOne({ courseCode: code }, { title: 1, students: 1, _id: 1 });
            if (!data) {
                return;
            }
            return data;
        }))
        return courseDetails;
    } catch (error) {
        logError('Error getting schedules', error);
    }
};