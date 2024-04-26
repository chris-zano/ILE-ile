const Courses = require("../../models/courses/courses.model");
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

exports.addChapter = (req, res) => {
    const { lecturerData } = req;
    const { courseId, v } = req.params;

    console.log(courseId, v)

    try {
        Courses.findOne({
            $and: [
                { _id: courseId },
                { __v: v }
            ]
        }).then((course) => {
            if (course == null) {
                console.log(course)
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

exports.addLesson = (req, res) => {
    const { lecturerData } = req;
    const { lessonName, chapter } = req.body;
    const { courseId, v } = req.params;

    Courses.findByIdAndUpdate(courseId)
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
                            title:  originalname,
                            owner: lecturerData.id,
                            fileType: originalname.slice(originalname.lastIndexOf(".") + 1),
                            url: `/courses/materials/${filename}`
                       }
                       chpt.courseMaterials.push(material);

                       course.save();

                    }

                    console.log(course.chapters[chapter - 1]);
                }
                res.redirect(`/lecturers/render/course/${courseId}/${lecturerData.id}`)
            }

        }).catch((error) => {
            logError(error)
            res.render('global/error', { error: "Failed to add lesson - not found", status: 404 })
        })
}