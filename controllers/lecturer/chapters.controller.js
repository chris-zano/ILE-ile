const { CoursesDB } = require('../../utils/global/db.utils');
const { getSystemDate, logError } = require("../admin/admin.utils");

//course material url = "/courses/materials/filename"

const newChapter = () => {
    const createdAt = getSystemDate();
    const newChapter = {
        lessons: [],
        courseMaterials: [],
        courseLectureRecordings: [],
        submissions: [],
        'created-at': createdAt
    }

    return newChapter;
}

const isfileType = (originalname) => {
    const validDocumentTypes = ['pptx', 'ppt', 'pdf', 'docx', 'doc', 'xls', 'xlsx', 'txt'];
    const validMediaTypes = ['mp4', 'mkv', 'mp3'];

    const fileType = originalname.slice(originalname.lastIndexOf(".") + 1);

    if (fileType == "") {
        return "executable";
    }

    if (validDocumentTypes.indexOf(fileType) !== -1) {
        return "document";
    }
    else if (validMediaTypes.indexOf(fileType) !== -1) {
        return "media";
    }
    else {
        return "invalid"
    }
}

module.exports.addChapter = (req, res) => {
    const { lecturerData } = req;
    const { courseId, v } = req.params;

    (courseId, v)

    try {
        CoursesDB().findOne({
            $and: [
                { _id: courseId },
                { __v: v }
            ]
        }).then((course) => {
            if (course == null) {
                res.render('global/error', { error: "Failed to add chapter - not found", status: 404 })
                return;
            }
            else {
                const newChpt = newChapter();
                course.chapters.push(newChpt);
                course.__v += 1;
                course.save();

                res.status(200).json({ message: 'success' })
            }

        }).catch((err) => {
            logError(err)
            res.render('global/error', { error: "Failed to add chapter - not found", status: 404 })
        })
    } catch (error) {
        logError(error)
        res.render('global/error', { error: "Failed to add chapter", status: 500 })
    }
}

module.exports.addLesson = (req, res) => {
    const { lecturerData } = req;
    const { lessonName, chapter } = req.body;
    const { courseId, v } = req.params;

    CoursesDB().findByIdAndUpdate(courseId)
        .then((course) => {
            if (course.__v == v) {
                if (req.file == undefined) {
                    //addlesson no file
                    const chpt = course.chapters[chapter - 1];
                    chpt.lessons.push(lessonName);
                    course.save();
                } else {
                    const { originalname, filename, path } = req.file;
                    const fileType = isfileType(originalname)
                    if (fileType !== "media" && fileType !== "invalid") {
                        //it is a document or executable [materials]
                        const chpt = course.chapters[chapter - 1];
                        chpt.lessons.push(lessonName);

                        const material = {
                            title: originalname,
                            owner: lecturerData.id,
                            fileType: originalname.slice(originalname.lastIndexOf(".") + 1),
                            url: `/courses/materials/${filename}`
                        }
                        chpt.courseMaterials.push(material);
                        course.save();
                    }
                    else if (fileType === "media") {
                        const chpt = course.chapters[chapter - 1];
                        chpt.lessons.push(lessonName);

                        const material = {
                            title: originalname,
                            owner: lecturerData.id,
                            fileType: originalname.slice(originalname.lastIndexOf(".") + 1),
                            url: `/courses/materials/${filename}`
                        }
                        chpt.courseLectureRecordings.push(material);
                        course.save();

                    }
                    else {
                        //reject file
                        const chpt = course.chapters[chapter - 1];
                        chpt.lessons.push(lessonName);
                        course.save();
                    }
                }
                res.redirect(`/lecturers/render/course/${courseId}/${lecturerData.id}`)
            }
        }).catch((error) => {
            logError(error)
            res.render('global/error', { error: "Failed to add lesson - not found", status: 404 })
        })
}


module.exports.deleteChapter = (req, res) => {
    const { lecturerData } = req;
    const { courseId, v, chapter } = req.params;

    CoursesDB().findByIdAndUpdate(courseId)
        .then((course) => {
            if (course == null) {
                res.redirect(`/lecturers/render/course/${courseId}/${lecturerData.id}`)
                return;
            }
            else {
                if (course.__v == v) {
                    course.chapters.splice(chapter - 1, 1);
                    course.save();
                }
                res.redirect(`/lecturers/render/course/${courseId}/${lecturerData.id}`);
            }
        }).catch((error) => {
            logError(error)
            res.render('global/error', { error: "Failed to add lesson - not found", status: 404 })
        })
}