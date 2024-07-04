import path from 'path';
import fs from 'fs';
import { AdminsDB } from '../../utils/global/db.utils';

const PATH_NOT_FOUND = "path not found";
const Admins = AdminsDB();

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
    switch (authLevel) {
        case 'admin':
            filePath = setFilePath('js', attribute, 'admin', filename);
            break;
        case 'lecturer':
            filePath = setFilePath('js', attribute, 'lecturer', filename);
            break;
        case 'student':
            filePath = setFilePath('js', attribute, 'student', filename);
            break;
        default:
            filePath = PATH_NOT_FOUND;
            break;
    }
    return filePath;
}

const getAdminProfilePicture = async (callState = "system", user_id = "") => {
    let copyCallState = callState;

    let defaultFilePath = path.join(__dirname, "..", "..", "public", "assets", "profile_pictures", "system", "admin.png");

    if (copyCallState === "system") {
        return fs.existsSync(defaultFilePath) ? defaultFilePath : PATH_NOT_FOUND
    }
    else if (copyCallState === "user") {
        const userObject = await Admins.findOne({ _id: user_id });
        const userProfilePath = !userObject ? (fs.existsSync(defaultFilePath) ? defaultFilePath : PATH_NOT_FOUND) : userObject.profilePicUrl;

        const resolvedUserProfilePath = path.resolve(__dirname, userProfilePath);
        return fs.existsSync(resolvedUserProfilePath) ? resolvedUserProfilePath : PATH_NOT_FOUND
    }
}

const getLecturersProfilePicture = async (callState = "system", request_params = {}) => {
    let copyCallState = callState;
    let defaultFilePath = path.join(__dirname, "..", "..", "public", "assets", "profile_pictures", "system", "admin.png");

    if (copyCallState === "system") {
        return fs.existsSync(defaultFilePath) ? defaultFilePath : PATH_NOT_FOUND
    }
    else if (copyCallState === "user") {
        const userObject = null;
        const userProfilePath = !userObject ? (fs.existsSync(defaultFilePath) ? defaultFilePath : PATH_NOT_FOUND) : userObject.profilePicUrl;
        const resolvedUserProfilePath = path.resolve(__dirname, userProfilePath);
        (resolvedUserProfilePath);
        return fs.existsSync(resolvedUserProfilePath) ? resolvedUserProfilePath : PATH_NOT_FOUND
    }
}

const getStudentsProfilePicture = async (callState = "system", request_params = {}) => {
    let copyCallState = callState;
    let defaultFilePath = path.join(__dirname, "..", "..", "public", "assets", "profile_pictures", "system", "admin.png");

    if (copyCallState === "system") {
        return fs.existsSync(defaultFilePath) ? defaultFilePath : PATH_NOT_FOUND
    }
    else if (copyCallState === "user") {
        const userObject = null;
        const userProfilePath = !userObject ? (fs.existsSync(defaultFilePath) ? defaultFilePath : PATH_NOT_FOUND) : userObject.profilePicUrl;
        const resolvedUserProfilePath = path.resolve(__dirname, userProfilePath);
        (resolvedUserProfilePath);
        return fs.existsSync(resolvedUserProfilePath) ? resolvedUserProfilePath : PATH_NOT_FOUND
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
    const randomImageUrl = url("oceanscolorful");

    res.set('Cache-Control', 'public, max-age=1200');
    res.type('jpg');
    fs.createReadStream(randomImageUrl).pipe(res);
}

export const getDefaultProfilePicture = async (req, res) => {
    const { userType, id } = req.params;
    const userTypeMatch = { "admins": getAdminProfilePicture, "lecturers": getLecturersProfilePicture, "students": getStudentsProfilePicture };
    const profilePictureconstReference = userTypeMatch[userType];

    if (profilePictureconstReference) {

        let profilePictureFilePath = null;

        profilePictureFilePath = id === "no-id" ? await profilePictureconstReference() : await profilePictureconstReference("user", id);

        if (profilePictureFilePath === PATH_NOT_FOUND) {
            res.status(404).json({ message: "File not found", path: req.url });
        }

        else {
            res.type('png');
            res.status(200);
            res.set('Cache-Control', 'public, max-age=8600');

            fs.createReadStream(profilePictureFilePath).pipe(res);
        }
    }
    else {
        res.status(404).json({ message: "User not found", path: req.url });
    }
}