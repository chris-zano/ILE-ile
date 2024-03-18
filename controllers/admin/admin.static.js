const Admins = require('../../models/admin/admin.models');
const adminUsersController = require('./admin.users');
const Courses = require('../../models/courses/courses.model');

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
                                admins: docs,
                            });
                        }).catch((err) => {
                            console.log("It happended here: ", err);
                        })
                }
                else {
                    if (doc.role === 'shepherd') {
                        // implement the feature to fetch all courses
                        Courses.find({department: doc.department})
                        .then((docs) => {
                            console.log(docs);
                            res.render('admin/dashboard', {
                                adminId: doc.adminId,
                                _id: doc._id,
                                adminObject: doc,
                                role: doc.role,
                                courses: docs
                            });
                        }).catch((error) => console.log('error on line 40: ', error));
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
                res.render('admin/dashboard', {
                    adminId: null,
                    _id: null,
                    adminObject: null,
                    role: null,
                    attempted_login: false
                });
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
    else {
        const { id, adminId, role } = req.query;
        const { action } = req.params;
        Admins.findOne({ _id: id, adminId: adminId, role: role })
            .then((doc) => {
                if (doc === null) {
                    res.render('admin/dashboard', {
                        adminId: null,
                        _id: null,
                        adminObject: null,
                        role: null,
                        attempted_login: true
                    });
                }
                else {
                    if (doc.adminId === adminId) {
                        switch (action) {
                            case 'create':
                                res.render('admin/login', {
                                    page: 'create-admin',
                                    css: ['login-1', 'login-2', 'login-3']
                                });
                                break;
                            case 'verify':
                                this.renderDashboard(req, res);
                                break;
                            case 'manage':
                                adminUsersController.manageUser(id, adminId, role, req.query.victim, res);
                                break;
                            default:
                                res.status(404).render('global/error', { status: '404' });

                        }
                    }
                    else res.status(404).render('global/error', { status: '404' });
                }
            }).catch((error) => {
                console.log(error);
                res.end("Error on this request '/admin/logins/create");
            });
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

exports.updateAdminInformation = (req, res) => {
    if (!req.headers['ur-u-a'] || req.headers['ur-u-a'] != 'y') {
        res.status(403).json({
            message: 'Unauthorized Access'
        });
        return;
    }

    const { v, id, adminId, firstName, lastName, role, department, password } = req.body;
    Admins.findByIdAndUpdate(id)
        .then(oldData => {
            if (oldData.__v === Number(v)) {
                oldData.adminId = adminId;
                oldData.firstName = firstName;
                oldData.lastName = lastName;
                oldData.role = role;
                oldData.department = department;
                oldData.password = password;
                oldData.__v = Number(oldData.__v) + 1;
                oldData.save();
                res.status(200).json('okay')
            }
            else {
                res.status(400).json('inconsistent data')
            }

        }).catch(error => {
            console.log('happened here: ', error);
        });
}

exports.deleteAdmin = (req, res) => {
    if (!req.headers['ur-u-a'] || req.headers['ur-u-a'] != 'y') {
        res.status(403).json({
            message: 'Unauthorized Access'
        });
        return;
    }

    const { v, id, adminId, firstName, lastName, role, department, password } = req.body;
    console.log(id);
    Admins.findOneAndDelete({_id: id, adminId: adminId, __v: v})
    .then(doc => {
        res.status(200).json('okay');
    }).catch(error => {
        console.log('happened here 2: ', error);
    })
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
                    res.status(200).json({ _id: doc._id, adminId: doc.adminId, role: doc.role, message: 'success' });
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