const Admins = require('../../models/admin/admin.models');
const adminUsersController = require('./admin.users');
const Courses = require('../../models/courses/courses.model');

const dashboardData = {
    pageTitle: 'Admin Dashboard',
    stylesheets: ['/css/admin/dashboard', '/css/admin/users', '/css/admin/courses', '/css/admin/reports', '/css/admin/settings', '/css/admin/import', '/css/admin/main'],
    utilityScripts: ['/script/utils/admin/util.restful'],
    headerUrl: 'global/header-admin',
    bodyUrl: 'admin/main'
};

//render the administrator's dashboard ( Home )
exports.renderDashboard = (req, res) => {
    const { id, adminId } = req.query;

    Admins.findOne({ _id: id, adminId: adminId })
        .then((doc) => {
            if (doc !== null) {
                renderDashboardByRole(res, doc);
            } else {
                res.render('index', {
                    pageTitle: 'Admin Dashboard',
                    stylesheets: ['/css/admin/dashboard', '/css/admin/users', '/css/admin/courses', '/css/admin/reports', '/css/admin/settings', '/css/admin/import', '/css/admin/main'],
                    utilityScripts: ['/script/utils/admin/util.restful'],
                    headerUrl: 'global/header-admin',
                    bodyUrl: 'admin/main',
                    adminId: null,
                    _id: null,
                    adminObject: null,
                    role: null,
                    attempted_login: false
                });
            }
        })
        .catch((error) => {
            renderErrorPage(res);
        });
};

function renderDashboardByRole(res, doc) {
    const copyDash = {...dashboardData}
    copyDash.adminId =  doc.adminId;
    copyDash._id= doc._id;
    copyDash.adminObject =  doc
    copyDash.role = doc.role

    switch (doc.role) {
        case 'archon':
            Admins.find({ _id: { $ne: doc._id }, adminId: { $ne: doc.adminId } })
                .then((docs) => {
                    res.render('index', { ...copyDash, admins: docs });
                })
                .catch((err) => {
                    console.error("Error fetching courses:", err);
                    renderErrorPage(res);
                });
            break;
        case 'shepherd':
            Courses.find({ department: doc.department })
                .then((docs) => {
                    res.render('index', { ...copyDash, courses: docs });
                })
                .catch((err) => {
                    console.error("Error fetching courses:", err);
                    renderErrorPage(res);
                });
            break;
        case 'forge':
            res.render('index', copyDash);
            break;
        default:
            renderErrorPage(res, 404);
            break;
    }
}

function renderErrorPage(res, status = '500') {
    res.status(status).render('global/error', { status });
}


//render the administrator's login page
exports.renderAdminLogin = (req, res) => {
    //TODO: log the request

    if (req.params.action === 'login') {
        res.render('admin/login', {
            page: 'login',
            ...dashboardData
        });
    }
    else {
        const { id, adminId, role } = req.query;
        const { action } = req.params;

        Admins.findOne({ _id: id, adminId: adminId, role: role })
            .then((doc) => {
                const copyDash = {...dashboardData}
                copyDash.adminId =  doc.adminId;
                copyDash._id= doc._id;
                copyDash.adminObject =  doc
                copyDash.role = doc.role
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
                                    ...copyDash
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
        .then((oldData) => {
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

        }).catch((error) => {
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
    Admins.findOneAndDelete({ _id: id, adminId: adminId, __v: v })
        .then((doc) => {
            res.status(200).json('okay');
        }).catch((error) => {
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
        .then((doc) => {
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
        })
        .catch((error) => {
            console.log(error);
            res.status(200).render('global/error', { status: 404 });
        })
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