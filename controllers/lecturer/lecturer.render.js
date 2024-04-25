const Tutors = require('../../models/lecturer/lecturer.model');
const Students = require('../../models/student/student.model');

const {logError, logSession, getSystemDate} = require('../admin/admin.utils');

exports.renderDashboard = (req, res) => {
    const { lecturerData } = req;

    res.render('lecturer/lecturer-main', {
        lecturer: lecturerData,
        pageTitle: "Dashboard",
        stylesheets: [],
        pageUrl: '',
        userType: 'Lecturer',
        scripts: []
    });
}