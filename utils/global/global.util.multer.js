import multer from 'multer';
import path from 'path';

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

export default configureUploadPath;