const { validateRequest } = require('../../utils/admin/admin.auth');

//render the administrator's dashboard ( Home )
exports.renderDashboard = (req, res) => {
    validateRequest(req)
        .then(auth => {
            if (auth.status == 'verified-user') {
                res.render('admin/dashboard');
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

//authenticate login request
exports.authLoginRequest = (req, res) => {
    //TODO: log request

    if (!req.headers['ur-u-a'] || req.headers['ur-u-a']!='y') {
        res.status(403).json({
            message: 'Unauthorized Access'
        });
        return;
    }
    
    const { username, password } = req.body;

    //models.authUserWithUsernameAndPassword

    res.status(200).json('Processed');
}