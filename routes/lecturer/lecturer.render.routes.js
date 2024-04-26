const express = require('express');
const router = express.Router();

//application imports
const {verifyLecturer} = require('../admin/router.utils');
const lecturerRender = require('../../controllers/lecturer/lecturer.render');



//get lecturer interfaces
router.get('/lecturers/render/dashboards/:id', verifyLecturer, lecturerRender.renderDashboard   )

module.exports = router;