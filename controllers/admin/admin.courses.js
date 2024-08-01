import { CoursesDB, LecturersDB, RegisteredCoursesDB, StudentsDB } from '../../utils/global/db.utils.js';
import { logError } from './admin.utils.js';

const Courses = CoursesDB();
const Students = StudentsDB();
const Lecturers = LecturersDB();
const RegisteredCourses = RegisteredCoursesDB();

export const getCoursesByOffset = async (req, res) => {
    const { adminData } = req;
    const { key, value, offset } = req.query;
    const limit = 256;
    const query = key === "default" || value === "null" ? {} : { [key]: value };
    // (query);
    try {
        const courses = await Courses.find(query).limit(limit).skip(offset).exec();

        if (courses) {
            res.status(200).json({ courses: courses, cursor: Number(offset) + limit });
        }
    }
    catch (error) {
        logError(error);
        res.status(500).json({ courses: [], cursor: 0 });
    }

    return;
}

const deleteForLecturers = async (courseCode) => {
    if (!courseCode) return false;
    try {
        const lecturers = await Lecturers.updateMany(
            { assignedCourses: courseCode },
            { $pull: { assignedCourses: courseCode } }
        );
        return lecturers.acknowledged
    } catch (error) {
        logError(error);
        return false;
    }
}

const deleteForStudents = async (courseCode) => {
    if (!courseCode) return false;
    try {
        const students = await Students.updateMany(
            { courses: { courseCode } },
            { $pull: { courses: courseCode } }
        );

        return students.acknowledged
    } catch (error) {
        logError(error);
        return false;   
    }
}

const deleteForSregistrationCodes = async (courseCode) => {
    if (!courseCode) return false;
    try {
        const codesDeleteStatus = await RegisteredCourses.updateMany(
            { courses: { courseCode } },
            { $pull: { courses: courseCode } }
        );

        return codesDeleteStatus.acknowledged
    } catch (error) {
        logError(error);
        return false;
    }
}

export const deleteCourse = async (req, res) => {
    const { courseId } = req.params;

    if (!courseId) return res.status(400).json({ message: "request is invalid" });

    try {
        //get course code
        const course = await Courses.findOne({ _id: courseId });
        if (!course) return res.status(404).json({ message: "resource not found" });

        const courseCode = course.courseCode;

        //delete for lecturers
        let deleteOperationResult = await deleteForLecturers(courseCode);
        if (!deleteOperationResult) console.log(`Failed to delete ${courseCode} for Lectuers`);

        //delete for students
        deleteOperationResult = await deleteForStudents(courseCode);
        if (!deleteOperationResult) console.log(`Failed to delete ${courseCode} for Students`);
        
        //delete for registeration codes
        deleteOperationResult = await deleteForSregistrationCodes(courseCode);
        if (!deleteOperationResult) console.log(`Failed to delete ${courseCode} for Registered courses`);

        //delete course itself
        const deleteResult = await Courses.deleteOne({ _id: courseId });

        if (deleteResult.deletedCount === 1) {
            console.log(`Course with id ${courseId} and courseCode ${courseCode} has been deleted.`);
            return res.status(200).json({ message: "deleted successfully" });
        }
        return res.status(404).json({ message: "resource not found" });
    } catch (error) {
        logError(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const manageCourses = async (req, res) => {
    const { courseId, id } = req.params;
    const { adminData } = req;
    const course = req.body;



    if (courseId === 'new') {
        try {
            const [lecturerId, name] = course.lecturer.split("_");

            const newCourse = new Courses({
                courseCode: course.courseCode,
                title: course.courseTitle,
                credit: course.creditHours,
                lecturer: {
                    lecturerId: lecturerId,
                    name: name
                },
                year: course.year,
                level: Number(course.level),
                semester: Number(course.semester),
                faculty: course.faculty,
                program: course.program,
            });

            await newCourse.save();

            await Lecturers.findOneAndUpdate(
                { lecturerId: lecturerId },
                { $addToSet: { assignedCourses: course.courseCode } }
            );

            res.redirect(`/admins/render/courses/${id}`);
        }
        catch (err) {
            logError(err)
        }
    }
    else {
        try {
            const [lecturerId, name] = course.lecturer.split("_");
            const updatedCourse = await Courses.findOneAndUpdate(
                { _id: courseId, __v: course.v },
                {
                    $set: {
                        courseCode: course.courseCode,
                        title: course.courseTitle,
                        "lecturer.lecturerId": lecturerId,
                        "lecturer.name": name,
                        year: course.year,
                        level: Number(course.level),
                        semester: Number(course.semester),
                        faculty: course.faculty,
                        program: course.program,
                        __v: Number(course.v) + 1,
                    }
                },
                { new: true }
            );
            if (!updatedCourse) return res.status(404).redirect(`/admins/render/courses/${id}`);

            await Lecturers.findOneAndUpdate(
                { lecturerId: lecturerId },
                { $addToSet: { assignedCourses: course.courseCode } }
            );

            return res.status(200).redirect(`/admins/render/courses/${id}`)
        } catch (err) {
            logError(err);
        }
    }
}


export const getCoursesByRegistrationCode = async (req, res) => {
    const { rcode } = req.query;

    try {
        const documentMatch = await RegisteredCourses.findOne({ registrationCode: rcode })
        if (!documentMatch) return res.status(200).json({ doc: null });

        const coursesMap = documentMatch.courses.map((courseCode) => Courses.findOne({ courseCode: courseCode }));
        const courses = await Promise.all(coursesMap);

        return res.status(200).json({ doc: courses });
    } catch (error) {
        logError(error);
        return res.status(500).json({ doc: null })
    }
}

const validateCourseCode = async (courseCode = "") => {
    try {
        const doc = await Courses.findOne({ courseCode: courseCode });
        if (!doc) return false;
        return true;
    } catch (error) {
        logError(error);
        return false
    }
}

const doesRegCodeExists = async (rcode = "") => {
    try {
        const doc = await RegisteredCourses.findOne({ registrationCode: rcode });
        if (!doc) return false;
        return true
    } catch (error) {
        console.log(error);
        return false;
    }
}

const addNewRegisteredCoursesEntry = async (rcode = "", courses = []) => {
    if (!rcode || courses.length === 0)
        return false

    try {
        const newEntry = new RegisteredCourses({ registrationCode: rcode, courses: courses });
        const savedData = await newEntry.save();
        return savedData;
    } catch (error) {
        logError(error);
        return false;
    }
}

const updateExistingRegisteredCourseEntry = async (rcode = "", courses = []) => {
    if (!rcode || courses.length === 0)
        return false
    try {
        const updateStatus = await RegisteredCourses.findOneAndUpdate(
            {
                registrationCode: rcode
            },
            {
                $set: { courses: courses }
            },
            { new: true, useFindAndModify: false }
        );
        return updateStatus;
    } catch (error) {
        logError(error);
        return false;
    }
}

export const setCoursesToRegistrationCode = async (req, res) => {
    const { courses } = req.body;
    const { rcode } = req.query;

    try {
        const validCourseCodesPromises = courses.map((courseCode) => validateCourseCode(courseCode));
        const validCourseCodesResults = await Promise.all(validCourseCodesPromises);
        const validCourseCodes = courses.filter((_, index) => validCourseCodesResults[index]);

        if (validCourseCodes.length === 0) {
            return res.status(400).json({ message: "Invalid course codes provided" });
        }

        const doesExist = await doesRegCodeExists(rcode);
        let rcObj = false;

        if (!doesExist)
            rcObj = await addNewRegisteredCoursesEntry(rcode, validCourseCodes);
        else
            rcObj = await updateExistingRegisteredCourseEntry(rcode, validCourseCodes);

        if (rcObj === false)
            return res.status(404).json({ message: "operation failed" });

        const coursesMap = rcObj.courses.map((courseCode) => Courses.findOne({ courseCode: courseCode }));
        const courseList = await Promise.all(coursesMap);
        console.log(courses)
        return res.status(200).json({ doc: courseList });
    }
    catch (error) {
        logError(error);
        return res.status(500).json({ message: "An unxpected error occured" });
    }
}

export const resetCoursesForRegistrationCode = async (req, res) => {
    const { rcode } = req.query;

    try {
        const doc = await RegisteredCourses.findOneAndUpdate(
            { registrationCode: rcode },
            {
                $set: { courses: [] }
            },
            { new: true, useFindAndModify: false }
        );
        if (!doc) return res.status(404).json({ message: "Document reset failed" });

        return res.status(200).json({ doc: doc });
    } catch (error) {
        logError(error);
        return res.status(500).json({ message: "An unexpected error occured" });
    }
}