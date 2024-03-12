const { validateRequest } = require('../../utils/admin/admin.auth');
const Admins = require('../../models/admin/admin.models');
//render the administrator's dashboard ( Home )
exports.renderDashboard = (req, res) => {
    validateRequest(req)
        .then(auth => {
            if (auth.status == 'verified-user') {
                res.render('admin/dashboard', {
                    adminId: null,
                    name: null,
                    'a-r': '---'
                });
            }
            else {
                res.end({
                    error: 'An error occured'
                });
            }
        })
        .catch(error => {
            res.end('Failed');
        })
}

//render the administrator's login page
exports.renderAdminLogin = (req, res) => {
    //TODO: log the request

    res.render('admin/login');
}

exports.createNewAdmin = (req, res) => {
    if (!req.headers['ur-u-a'] || req.headers['ur-u-a'] != 'y') {
        res.status(403).json({
            message: 'Unauthorized Access'
        });
        return;
    }

    const { adminId, firstName, lastName, role, department, password } = req.body;

    const admin = new Admins({ adminId, firstName, lastName, role, password, department });

    admin.save();

}

//authenticate login request
exports.authLoginRequest = (req, res) => {
    //TODO: log request

    if (!req.headers['ur-u-a'] || req.headers['ur-u-a'] != 'y') {
        res.status(403).json({
            message: 'Unauthorized Access'
        });
        return;
    }

    const { adminId, password } = req.body;
    //models.authUserWithUsernameAndPassword

    Admins.find({ adminId: adminId, password: password })
        .then(doc => {
            console.log(doc);
            if (doc.length === 0) {
                res.status(403).json('failed')
            }

            else {
                res.status(200).json({ user: doc[0], message: 'success' });
            }
        });
}