const Admins = require('../../models/admin/admin.models');

function validateRequest(requestObject) {
    
    return new Promise((resolve, reject) => {
        const authKey = requestObject.headers['u-a-k'];
        
        Admins.findOne({adminId: authKey})
        .then((doc) => {
            resolve({
                status: 'verified-user',
                authToken: 'valid-auth-token',
                data: doc
            });
        })
        .catch((error) => {
            console.log(error);
            reject({
                error: error,
                status: 'verified-user',
                authToken: 'invalid-auth-token'
            });
        })
    })
}

module.exports = {validateRequest};