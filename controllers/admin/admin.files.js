import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { AdminsDB, LecturersDB, StudentsDB } from '../../utils/global/db.utils.js';
import { logError } from './admin.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PATH_NOT_FOUND = "path not found";
const Admins = AdminsDB();
const Students = StudentsDB();
const Lecturers = LecturersDB();

const setFilePath = (mimeType, attribute, authFolder, filename) => {
    var resolvedpath;

    switch (mimeType) {
        case 'js':
            resolvedpath = path.join(__dirname, '..', '..', 'public', 'js', `${attribute}`, `${authFolder}`, `${filename}.js`);
            break;
        case 'css':
            resolvedpath = path.join(__dirname, '..', '..', 'public', 'css', `${authFolder}`, `${filename}.css`);
            break;
        default:
            resolvedpath = PATH_NOT_FOUND;
            break;
    }


    if (fs.existsSync(resolvedpath)) {
        return resolvedpath;
    }
    else {
        return PATH_NOT_FOUND;
    }
}

const getScriptFilePath = (attribute, authLevel, filename) => {
    let filePath;

    try {
        return filePath = setFilePath('js', attribute, authLevel, filename);
    }
    catch (error) {
        logError(error);
        return filePath = PATH_NOT_FOUND;
    }
}

export const loadScript = (req, res) => {
    const { auth, filename } = req.params;
    const filePath = getScriptFilePath('scripts', auth, filename);

    if (filePath != PATH_NOT_FOUND) {
        // res.set('Cache-Control', 'public, max-age=45');
        res.type('text/javascript');
        fs.createReadStream(filePath).pipe(res);
    }
    else {
        ('javascript file: ', req.url, ' file not found');
        res.status(400);
        res.end();
    }
}

export const loadUtilityScript = (req, res) => {
    const { auth, filename } = req.params;

    const filePath = getScriptFilePath('utils', auth, filename);

    if (filePath != PATH_NOT_FOUND) {
        // res.set('Cache-Control', 'public, max-age=45');
        res.type('text/javascript');
        fs.createReadStream(filePath).pipe(res);
    }
    else {
        ('javascript file: ', req.url, ' file not found');
        res.status(400);
        res.end();
    }
}

export const getStyleSheet = (req, res) => {
    const { auth, filename } = req.params;
    const filePath = setFilePath('css', null, auth, filename);

    if (filePath != PATH_NOT_FOUND) {
        // res.set('Cache-Control', 'public, max-age=30');
        res.type('css');
        fs.createReadStream(filePath).pipe(res);
    }
    else {
        ('css file: ', req.url, ' file not found');
        res.status(404);
        res.end();
    }
}

export const getImage = (req, res) => {
    const filePath = path.join(__dirname, '..', '..', 'public', 'assets', 'images', `${req.params.filename}.png`);
    res.type('png');
    res.set('Cache-Control', 'public, max-age=3600');
    fs.createReadStream(filePath).pipe(res);
}

export const getSystemImage = (req, res) => {
    const filePath = path.join(__dirname, '..', '..', 'public', 'assets', 'images', 'system', `${req.params.filename}.png`);
    res.type('png');
    res.set('Cache-Control', 'public, max-age=3600');
    fs.createReadStream(filePath).pipe(res);
}

export const getFavicon = (req, res) => {
    const filePath = path.join(__dirname, '..', '..', 'public', 'assets', 'favicon', 'favicon.png');
    res.set('Cache-Control', 'public, max-age=86400');
    res.type('image/x-icon');
    fs.createReadStream(filePath).pipe(res);
}

export const getFonts = (req, res) => {
    const filePath = path.join(__dirname, '..', '..', 'public', 'assets', 'fonts', `${req.params.filename}.ttf`);
    res.set('Cache-Control', 'public, max-age=86400');
    res.type('font/ttf');
    fs.createReadStream(filePath).pipe(res);
}

export const getRandomImage = (req, res) => {
    const url = (filename) => {
        return path.join(__dirname, '..', '..', 'public', 'assets', 'random_images', `${filename}.jpg`)
    }
    const imageurls = [
        url("porto"),
        url("italy"),
        url("great_wall"),
        url("hintersee"),
        url("mclaren"),
        url("lake_hintersee"),
        url("oceanscolorful"),
    ]

    const randomIndex = Math.floor(Math.random() * imageurls.length);
    const randomImageUrl = url("computer architecture");

    res.set('Cache-Control', 'public, max-age=1200');
    res.type('jpg');
    fs.createReadStream(randomImageUrl).pipe(res);
}

export const getDefaultProfilePicture = async (req, res) => {
    const { userType, id, filename } = req.params;

    if (!userType || !id) {
        return res.status(404).json({ message: "Resource not found" });
    }

    try {
        const genericFilePath = path.join(__dirname, '..', '..', 'public', 'assets', 'images', 'system', 'user.png');

        if (!fs.existsSync(genericFilePath)) {
            return res.status(404).redirect("/global/error");
        }

        if (id === "no-id") {
            res.type('png');
            res.status(200);
            res.set('Cache-Control', 'public, max-age=8600');
            return fs.createReadStream(genericFilePath).pipe(res);
        }

        const filePath = path.join(__dirname, '..', '..', 'public', 'assets', 'profile_pictures', 'users', filename);

        if (!fs.existsSync(filePath)) {
            console.log(`Cannot find file`)
            res.type('png');
            res.status(200);
            res.set('Cache-Control', 'public, max-age=8600');
            return fs.createReadStream(genericFilePath).pipe(res);
        }

        res.type('png');
        res.status(200);
        res.set('Cache-Control', 'public, max-age=8600');
        fs.createReadStream(filePath).pipe(res);
    } catch (error) {
        console.log(`Error in getDefaultProfilePicture: ${error}`);
        return res.status(500).json("Internal Server Error");
    }
}

export const getSubmissionFile = (req, res) => {
    const { filename } = req.params;

    if (!filename || filename === 'no-filename') {
        console.log("(get-submission) => filename not valid: ", filename);
        return res.status(400).json({ message: "request does not have a valid filename" });
    }
    try {
        const filePath = path.join(__dirname, '..', '..', 'public', 'assets', 'submissions', filename);

        if (!fs.existsSync(filePath)) {
            console.log(`(get-submission) => filepath does not exist: ${filePath}`);
            return res.status(404).json({ message: 'resource not found' });
        }


        res.status(200);
        fs.createReadStream(filePath).pipe(res);
        return;

    } catch (error) {
        console.log(`(get-submission) => Error:: an unexpected error occured\n`, error);
        return res.status(500).json({ message: 'internal server error' });
    }
}

export const getAnnouncementFile = (req, res) => {
    const { filename } = req.query;

    if (!filename) {
        console.log("(get-announcements) => filename not valid: ", filename);
        return res.status(400).json({ message: "request does not have a valid filename" });
    }

    try {
        const filePath = path.join(__dirname, '..', '..', 'public', 'assets', 'announcements', filename);

        if (!fs.existsSync(filePath)) {
            console.log(`(get-announcements) => filepath does not exist: ${filePath}`);
            return res.status(404).json({ message: 'resource not found' });
        }


        res.status(200);
        fs.createReadStream(filePath).pipe(res);
        return;

    } catch (error) {
        console.log(`(get-announcements) => Error:: an unexpected error occured\n`, error);
        return res.status(500).json({ message: 'internal server error' });
    }
}

export const getLibraryFile = (req, res) => {
    const { filename } = req.query;

    if (!filename) {
        console.log("(get-library-file) => filename not valid: ", filename);
        return res.status(400).json({ message: "request does not have a valid filename" });
    }

    try {
        const filePath = path.join(__dirname, '..', '..', 'public', 'assets', 'library', filename);
        if (!fs.existsSync(filePath)) {
            console.log(`(get-library-file) => filepath does not exist: ${filePath}`);
            return res.status(404).json({ message: 'resource not found' });
        }
        
        
        console.log(filePath)
        console.log(`(get-library-file) => filepath exists: ${filePath}`);
        res.status(200);
        fs.createReadStream(filePath).pipe(res);
        console.log('here')
        return;

    } catch (error) {
        console.log(`(get-library-file) => Error:: an unexpected error occured\n`, error);
        return res.status(500).json({ message: 'internal server error' });
    }
}