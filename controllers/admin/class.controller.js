const { AdminsDB, StudentsDB, CoursesDB, LecturersDB, ClassesDB } = require('../../utils/global/db.utils');
const { getStudentsDataByOffset } = require('./admin.users');
const { logError } = require('./admin.utils');


const getBCE = () => {
    getStudentsDataByOffset(0, "program", "BSc. Computer Engineering", 65)
        .then((r) => {
            if (r.status == 200 && r.message == 'success' && r.docs.length <= 65) {
                console.log(r.docs);
            }
            return 0
        })
        .catch((e) => {
            if (e) {
                logError(e);
                return null;
            }
        })
}

exports.runCreateClasses = (req, res) => {
    const { adminData } = req;
    const classes = ClassesDB();

    classes.find()
        .then((classes) => {
            if (classes.length == 0) {
                console.log(classes);
                getBCE()
            }
            else {
                console.log("here");
                // res.redirect(`/admins/render/classrooms/${adminData.id}`);
            }
        })
        .catch((error) => {
            if (error) {
                logError(error)
            }
            res.render('gobal/error', { error: "Failed to get classes", status: 500 })
        })
}