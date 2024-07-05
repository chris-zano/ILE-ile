import {CoursesDB } from '../../utils/global/db.utils.js';
import {logError } from './admin.utils.js';

const Courses = CoursesDB();

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
            CoursesDB().findByIdAndUpdate({ _id: courseId })
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

