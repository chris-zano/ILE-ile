const adminAuthUtil = require('../../utils/admin/admin.auth');

exports.renderDashboard = (req, res) => {
    adminAuthUtil.validateRequest(req)
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