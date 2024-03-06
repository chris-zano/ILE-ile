const multer = require('multer');
const path = require('path');

const configureUploadPath = (uploadPath) => {
    try {
        return multer({
            dest: (req, file, cb) => {
                const resolvedDir = path.resolve(__dirname, uploadPath);
                cb(null, resolvedDir);
            }
        });
    }
    catch (error) {
        console.log(error)
        return ({
            status: 'Failed',
            error: error
        });
    }
}

module.exports = { configureUploadPath };