const Admins = require('../../models/admin/admin.models');

exports.verifyAdmin = (req, res, next) => {
    Admins.findById(id)
        .then((admin) => {
            if (admin == null) {
                utils.logError(new ReferenceError());
                res.render('global/error', { message: "Unauthorised access", status: 403 });
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
    const {username, password} = req.body;

    console.log(username)
    next();
}