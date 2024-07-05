import { CoursesDB, RegisteredCoursesDB } from '../../utils/global/db.utils.js';
import { logError } from './admin.utils.js';

const Courses = CoursesDB();
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
            res.redirect(`/admins/render/courses/${id}`)

        }
        catch (err) {
            logError(err)
        }
    }
    else {
        try {
            const [lecturerId, name] = course.lecturer.split("_");
            Courses.findByIdAndUpdate({ _id: courseId })
                .then((c) => {
                    if (c.__v === Number(course.v)) {
                        c.courseCode = course.courseCode
                        c.title = course.courseTitle
                        c.lecturer.lecturerId = lecturerId;
                        c.lecturer.name = name;
                        c.year = course.year
                        c.level = Number(course.level)
                        c.semester = Number(course.semester)
                        c.faculty = course.faculty
                        c.program = course.program
                        c.__v = Number(course.v) + 1
                        c.save();
                        res.redirect(`/admins/render/courses/${id}`)

                    }
                    else {
                        res.render('global/error', { error: "Failed to update course - [ Inconsistent Data ]", status: 400 })
                    }
                })
        } catch (err) {
            logError(err);
        }
    }
}


export const getCoursesByRegistrationCode = async (req, res) => {
    const { rcode } = req.query;

    try {
        const documentMatch = await RegisteredCourses.findOne({ registrationCode: rcode })
            .populate("courseDetails")
            .exec();

        return res.status(200).json({ doc: documentMatch });
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
        await newEntry.save();
        return true;
    } catch (error) {
        logError(error);
        return false;
    }
}

const updateExistingRegisteredCourseEntry = async (rcode = "", courses = []) => {
    if (!rcode || courses.length === 0)
        return false
    try {
        const updateStatus = await RegisteredCourses.updateOne({ registrationCode: rcode }, {
            $set: { courses: courses }
        });
        return updateStatus.matchedCount === 1 && updateStatus.modifiedCount === 1;
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
        let opState = false;

        if (!doesExist)
            opState = await addNewRegisteredCoursesEntry(rcode, validCourseCodes);
        else
            opState = await updateExistingRegisteredCourseEntry(rcode, validCourseCodes);

        if (!opState)
            return res.status(404).json({ message: "operation failed" });

        return res.status(200).json({ message: "success" });
    }
    catch (error) {
        logError(error);
        return res.status(500).json({ message: "An unxpected error occured" });
    }
}