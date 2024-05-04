const { AdminsDB, StudentsDB, CoursesDB, LecturersDB } = require('../../utils/global/db.utils');


exports.runCreateClasses = (req, res) => {
    const {adminData} = req;

    res.redirect(`/admins/render/classrooms/${adminData.id}`);
}