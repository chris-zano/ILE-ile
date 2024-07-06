import { CoursesDB, RegisteredCoursesDB, StudentsDB } from "../../utils/global/db.utils.js";
import { logError } from "../admin/admin.utils.js";

const Students = StudentsDB();
const Courses = CoursesDB();
const RegisteredCourses = RegisteredCoursesDB();

const updateCourseStudentList = async (courseCode = "", studentId = "") => {
    if (!courseCode || !studentId) return false;

    try {
        await Courses.findOneAndUpdate(
            { courseCode: courseCode },
            { $addToSet: { students: studentId } }
        );
        return true;
    } catch (error) {
        logError(error);
        return false;
    }
};

const updateStudentCourseList = async (studentId = "", courses) => {
    if (!studentId || !courses) return false;

    try {
        await Students.findOneAndUpdate(
            { studentId: studentId },
            { $set: { courses: [...courses] } }
        );
        return true;
    } catch (error) {
        logError(error);
        return false;
    }
};

const updateRegistrationCodeStudentsList = async (code, studentId) => {
    if (!code || !studentId) return false;

    try {
        await RegisteredCourses.findOneAndUpdate(
            { registrationCode: code },
            { $addToSet: { students: studentId } }
        );

        return true;
    } catch (error) {
        logError(error);
        return false
    }
}
export const setCourseRegistration = async (req, res) => {
    const { studentData } = req;
    const { courses } = req.body;
    const { rcode } = req.query

    try {
        const courseListToUpdate = courses.map((courseCode) => updateCourseStudentList(courseCode, studentData.studentId));
        const results = await Promise.all(courseListToUpdate);

        if (results.includes(false)) {
            return res.status(500).json({ message: "An error occurred while updating course student lists" });
        }

        const studentUpdateResult = await updateStudentCourseList(studentData.studentId, courses);
        if (!studentUpdateResult) {
            return res.status(500).json({ message: "An error occurred while updating student course list" });
        }
        
        const registeredCoursesResult = await updateRegistrationCodeStudentsList(rcode, studentData.studentId);
        if (!registeredCoursesResult) {
            return res.status(500).json({ message: "An error occurred while updating registration code student list" });
        }

        return res.status(200).json({ message: "success" });
    } catch (error) {
        logError(error);
        return res.status(500).json({ message: "An unexpected error occurred" });
    }
};
