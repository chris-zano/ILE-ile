const Admins = require('../../models/admin/admin.models');
const utils = require('../../controllers/admin/admin.utils');

exports.verifyAdmin = (req, res, next) => {
    Admins.findById(req.params.id)
        .then((admin) => {
            if (admin == null) {
                utils.logError(new ReferenceError());
                res.render('global/error', { message: "Unauthorised access", status: 403 });
                return
            }
            else {
                req.adminData = {
                    id: admin._id,
                    firstname: admin.firstName,
                    lastname: admin.lastName,
                    faculty: admin.faculty
                }
                next();
            }
        }).catch((error) => {
            
            utils.logError(error);
            return {
                message: "An error occured",
                admin: {},
                status: 500
            }
        });
}

exports.authenticateLoginSequence = (req, res, next) => {
    const { username, password } = req.body;
    const user = String(username)

    const adminRegexp = /^AD-\d{3}[A-Za-z0-9]*$/;
    const tutorRegexp = /^TU-\d{3}[A-Za-z0-9]*$/;
    const studentRegexp = /^\d{9}$/;


    if (adminRegexp.test(user)) req.usernameformat = "admin";
    else if (tutorRegexp.test(user)) req.usernameformat = "tutor";
    else if (studentRegexp.test(user)) req.usernameformat = "student";
    else req.usernameformat = "none";


    if (req.usernameformat == "none") {
        res.status(403).json({ message: "Unauthorised login" })
        return;
    }

    next();
}