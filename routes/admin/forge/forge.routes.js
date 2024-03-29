//system imports
const express = require('express');
const router = express.Router();

//forge.controllers.js
const courses = require('../../../controllers/admin/forge/courses.forge');
const createOne = require('../../../controllers/admin/forge/create-one.forge');
const dashboard = require('../../../controllers/admin/forge/dashboard.forge');
const imports = require('../../../controllers/admin/forge/import.forge');
const lecturers = require('../../../controllers/admin/forge/lecturers.forge');
// const manageOne = require('../../../controllers/admin/forge/manageOne.forge');
// const manageUsers = require('../../../controllers/admin/forge/manageUsers.forge');
// const settings = require('../../../controllers/admin/forge/settings.forge');
// const students = require('../../../controllers/admin/forge/students.forge');
// const profile = require('../../../controllers/admin/forge/profile.forge');

router.get('/forge/lecturers/:prop/:action/:_id', lecturers);

module.exports = router;