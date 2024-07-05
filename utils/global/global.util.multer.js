import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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