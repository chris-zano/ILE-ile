const path = require('path');
const fs = require('fs');
const { AutoEncryptionLoggerLevel } = require('mongodb');

function setFilePath(mimeType, attribute, authFolder, filename) {
    var resolvedpath;

    switch (mimeType) {
        case 'js':
            resolvedpath = path.join(__dirname, '..', '..', 'public', 'js', `${attribute}`, `${authFolder}`, `${filename}.js`);
            break;
        case 'css':
            resolvedpath = path.join(__dirname, '..', '..', 'public', 'css', `${authFolder}`, `${filename}.css`);
            break;
        default:
            resolvedpath = 'not found';
            break;
    }


    if (fs.existsSync(resolvedpath)) {
        return resolvedpath;
    }
    else {
        return 'not found';
    }
}

function getScriptFilePath(attribute, authLevel, filename) {
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
            filePath = 'not found';
            break;
    }
    return filePath;
}

module.exports.loadScript = (req, res) => {
    const { auth, filename } = req.params;
    const filePath = getScriptFilePath('scripts', auth, filename);

    if (filePath != 'not found') {
        // res.set('Cache-Control', 'public, max-age=45');
        res.type('text/javascript');
        fs.createReadStream(filePath).pipe(res);
    }
    else {
        console.log('file not found');
        res.status(400);
        res.end();
    }
}

module.exports.loadUtilityScript = (req, res) => {
    const { auth, filename } = req.params;

    const filePath = getScriptFilePath('utils', auth, filename);

    if (filePath != 'not found') {
        // res.set('Cache-Control', 'public, max-age=45');
        res.type('text/javascript');
        fs.createReadStream(filePath).pipe(res);
    }
    else {
        console.log('file not found');
        res.status(400);
        res.end();
    }
}

module.exports.getStyleSheet = (req, res) => {
    const { auth, filename } = req.params;
    const filePath = setFilePath('css', null, auth, filename);

    if (filePath != 'not found') {
        // res.set('Cache-Control', 'public, max-age=30');
        res.type('css');
        fs.createReadStream(filePath).pipe(res);
    }
    else {
        console.log('file not found');
        res.status(404);
        res.end();
    }
}

module.exports.getImage = (req, res) => {
    const filePath = path.join(__dirname, '..', '..', 'public', 'assets', 'images', `${req.params.filename}.png`);
    res.type('png');
    res.set('Cache-Control', 'public, max-age=3600');
    fs.createReadStream(filePath).pipe(res);
}

module.exports.getFavicon = (req, res) => {
    const filePath = path.join(__dirname, '..', '..', 'public', 'assets', 'favicon', 'favicon.png');
    res.set('Cache-Control', 'public, max-age=86400');
    res.type('image/x-icon');
    fs.createReadStream(filePath).pipe(res);
}

module.exports.getFonts = (req, res) => {
    const filePath = path.join(__dirname, '..', '..', 'public', 'assets', 'fonts', `${req.params.filename}.ttf`);
    res.set('Cache-Control', 'public, max-age=86400');
    res.type('font/ttf');
    fs.createReadStream(filePath).pipe(res);
}

module.exports.getRandomImage = (req, res) => {
    function url (filename) {
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
