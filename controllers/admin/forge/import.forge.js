const path = require('path');
const fs = require('fs');

const Admins = require('../../../models/admin/admin.models');
const Students = require('../../../models/student/student.model');
const Lecturers = require('../../../models/lecturer/lecturer.model');
const Files = require('../../../models/courses/files.models');


const lecturersProperties = ['lecturerId', 'firstName', 'lastName', 'faculty'];
const studentsproperties = ['studentId', 'firstName', 'lastName', 'program','level', 'faculty'];
let error_message = "";

const respondBadRequest = (res, error_message = 'An error occured', statusCode = 400) => {
    res.status(statusCode).render('global/error', { error: error_message, statusCode });
    return;
}

const validateImportedJSON = (jsonObject = {}, properties = []) => {
    if (!Array.isArray(properties)) {
        throw new Error("Properties must be an array!");
    }

    if (Object.keys(jsonObject).length === 0) {
        throw new Error("Invalid JSON Object. Object must not be empty");
    }

    const missingProperties = properties.filter((prop) => jsonObject.hasOwnProperty(prop));

    return (missingProperties.length === 0);
}

const validateAdmin = (id, adminId, role) => { 
    Admins.findOne({_id: id, adminId: adminId, role: role})
    .then((doc) => {
        if (doc == null) {
            const error_message = `Invalid auth credential. You are not authorised to perform this operation`;
            respondBadRequest(res, error_message, 403);
            return false;
        }
        return true;
    }).catch((error) => {
        console.log(error);
        const error_message = "An error occured during user validation";
        respondBadRequest(res, error_message, 500);
        return false;
    })
}

const sModel = (s) => {
    try {
        const stud = new Students({
            studentId: s.studentId,
            firstName: s.firstName,
            lastName: s.lastName,
            program: s.program,
            level: s.level,
            faculty: s.faculty
        });

        stud.save();
    }
    catch (error) {
        const error_message = `Internal server Error. Failed to create a new Student {${s}}`
        respondBadRequest(500,error_message, 500);
        return false;
    }

    return true;
}

const lModel = (l) => {
    try {
        const tutor = new Lecturers({
            lecturerId: l.lecturerId,
            firstName: l.firstName,
            lastName: l.lastName,
            faculty: l.faculty
        });

        tutor.save();
    }
    catch(error) {
        const error_message = `Internal server Error. Failed to create a new Lecturer {${l}}`;
        respondBadRequest(500, error_message, 500);
    }
}

/**
 * request pack
 * /forge/imports/:action(imports, render)/:userType(student, tutor)
 * 
 * headers {
 *      'admin-uid': id,
 *      'admin-id': adminId,
 *      'admin-role': role
 * }
 * 
 */
const handleUserImport = (req, res) => {
    const { action, userType} = req.params;
    const headerInfo = {
        id: req.headers['admin-uid'],
        adminId: req.headers['admin-id'],
        role: req.headers['admin-role']
    }

    if(!validateAdmin(id, adminId, role)) return;

    const { originalname, filename } = req.file;
    const filePath = path.join(__dirname, '..', '..', '..', 'models', 'imports', filename);
    const userTypeValidProperties = {
        student: { props: studentsproperties, model: sModel },
        tutor: { props: lecturersProperties, model: lModel }
    };
    const validUserTypeCheck = userTypeValidProperties[userType];

    if (!validUserTypeCheck) {
        const error_message = `Invalid user type import. Expected {student,tutor}, instead got {${userType}}`;
        respondBadRequest(res, error_message);
        return;
    }

    try {
        const userArray = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (!Array.isArray(userArray)) {
            const error_message = `Invalid Import. File not valid JSON {${filePath}}`
            respondBadRequest(res, error_message);
            return;
        }

        userArray.forEach((user) => {
            if (!validateImportedJSON(user, validUserTypeCheck.props)) {
                const error_message = `Invalid import objects. Missing object Properties {${validUserTypeCheck}}`;
                respondBadRequest(res, error_message);
                return;
            }

            if(!validUserTypeCheck.model(user)) return;
        });

        const newFile = new Files({
            filename,
            originalname,
            fileUrl: filePath,
            owner: id,
            'created-at': new Date().getDate()
        });
        newFile.save();
        res.status(200).redirect(`/admin/dashboards?id=${id}&&adminId=${adminId}`)
    }
    catch (error) {
        res.status(500).render('global/error', { error: `failed to read file: {${filePath}}`, statusCode: 500 });

        throw new Error("Failed to read JSON import: ", error);
    }
}

module.exports = handleUserImport;