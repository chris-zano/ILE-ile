const { validateRequest } = require('../../utils/admin/admin.auth');
const Admins = require('../../models/admin/admin.models');

//render the administrator's dashboard ( Home )
exports.renderDashboard = (req, res) => {
    //validate the request
    validateRequest(req)
        .then(auth => {
            if (req.query.redirect === 't') {
                res.status(200).json({message: 'success', url: '/admin/dashboard', authToken: authToken});
            }
            else if (req.query.authToken) {

            }
            else {
                res.render('admin/dashboard', {
                    adminId: adminId,
                    adminObject: auth.data,
                    role : auth.data.role
                });
            }
        })
        .catch(error => {
            if (req.query.redirect === 't') {
                res.status(403).json({message: 'Unauthorised'});
            }
            else {
                res.render('admin/dashboard', {
                    adminId: null,
                    adminObject:null,
                    role: '-----'
                });
            }
        })
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
        res.render('admin/login', {
            page: 'create-admin',
            css: ['login-1', 'login-2', 'login-3']
        });
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

    console.log(admin);

    res.status(200).json({message: 'success'});

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