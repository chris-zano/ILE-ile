const { validateRequest } = require('../../utils/admin/admin.auth');
const Admins = require('../../models/admin/admin.models');

//render the administrator's dashboard ( Home )
exports.renderDashboard = (req, res) => {
    //validate the request
    const { id, adminId } = req.query;

    Admins.findOne({ _id: id, adminId: adminId })
        .then((doc) => {
            if (doc !== null) {
                if (doc.role === 'archon') {
                    Admins.find({ _id: { $ne: id }, adminId: { $ne: adminId } })
                        .then((docs) => {
                            res.render('admin/dashboard', {
                                adminId: doc.adminId,
                                _id: doc._id,
                                adminObject: doc,
                                role: doc.role,
                                admins: docs
                            });
                        }).catch((err) => {
                            console.log("It happended here: ", err);
                        })
                }
                else {
                    if (doc.role === 'shepherd') {
                        // implement the feature to fetch all courses
                        res.render('admin/dashboard', {
                            adminId: doc.adminId,
                            _id: doc._id,
                            adminObject: doc,
                            role: doc.role,
                            courses: []
                        });
                    }
                    else if (doc.role === 'forge') {
                        res.render('admin/dashboard', {
                            adminId: doc.adminId,
                            _id: doc._id,
                            adminObject: doc,
                            role: doc.role
                        });
                    }
                    else {
                        res.status(404).render('global/error', { status: '404' });
                    }
                }
            }

            else {
                res.status(404).render('global/error', { status: '404' });
            }
        })
        .catch((error) => {
            res.render('admin/dashboard', {
                adminId: null,
                _id: null,
                adminObject: null,
                role: null
            });
        });
}

//render the administrator's login page
exports.renderAdminLogin = (req, res) => {
    //TODO: log the request

    if (req.params.action === 'login') {
        res.render('admin/login', {
            page: 'login',
            css: ['login-1', 'login-2', 'login-3']
        });
    }
    else if (req.params.action === 'create') {
        const { id, adminId, role } = req.query;
        Admins.findOne({ _id: id, adminId: adminId, role: role })
            .then((doc) => {
                res.render('admin/login', {
                    page: 'create-admin',
                    css: ['login-1', 'login-2', 'login-3']
                });
            }).catch((error) => {
                console.log(error);
                res.end("Error on this request '/admin/logins/create");
            })
    }
    else {
        res.status(404).render('global/error', { status: '404' });
    }

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


    res.status(200).json({ message: 'success' });

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

    Admins.findOne({ adminId: adminId, password: password })
        .then(doc => {
            console.log(doc);
            if (doc !== null) {
                if (doc.length === 0) {
                    res.status(403).json('failed')
                }
                else {
                    res.status(200).json({ _id: doc._id, adminId: doc.adminId, message: 'success' });
                }
            }
            else {
                res.status(404).render('global/error', { status: '404' });
            }
        });
}

exports.renderUserImportPage = (req, res) => {
    const { id, adminId, role } = req.query;
    const { victim } = req.params;

    Admins.findOne({ _id: id, adminId: adminId, role: role })
        .then((doc) => {
            if (doc !== null) {
                if (doc.adminId === adminId) {
                    res.render('admin/import', { victim: victim, id, adminId, role });
                }
                else {
                    res.render('global/error');
                }
            }

            else {
                res.status(404).render('global/error', { status: '404' });
            }
        }).catch((error) => {
            console.log(error);
            res.render('global/error');
        });
}