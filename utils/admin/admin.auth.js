function validateRequest(requestObject) {
    return new Promise((resolve, reject) => {
        const authKey = requestObject.headers['user-auth-key'];

        if (authKey == 'valid-auth-key') {
            resolve({
                status: 'verified-user',
                authToken: 'valid-auth-token'
            });
        }
        else {
            resolve({
                status: 'verified-user',
                authToken: 'invalid-auth-token'
            });
        }
    })
}

module.exports = {validateRequest};