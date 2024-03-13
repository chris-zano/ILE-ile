const path = require('path');
const fs = require('fs');

function setFilePath(mimeType, attribute, authFolder, filename) {
    var resolvedpath;

    switch (mimeType) {
        case 'js':
            resolvedpath = path.join(__dirname, '..', '..', 'public', `${mimeType}`, `${attribute}`, `${authFolder}`, `${filename}.js`);
            break;
        case 'css':
            resolvedpath = path.join(__dirname, '..', '..', 'public', `${mimeType}`, `${attribute}`, `${authFolder}`, `${filename}.css`);
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

function getStyleSheetFilePath(auth, attribute, filename) {
    // let filepath;
}

exports.loadScript = (req, res) => {
    const { auth, filename } = req.params;
    const filePath = getScriptFilePath('scripts', auth, filename);

    if (filePath != 'not found') {
        res.type('text/javascript');
        fs.createReadStream(filePath).pipe(res);
    }
    else {
        console.log('file not found');
        res.status(400);
        res.end();
    }
}

exports.loadUtilityScript = (req, res) => {
    const { auth, filename } = req.params;

    const filePath = getScriptFilePath('utils', auth, filename);

    if (filePath != 'not found') {
        res.type('text/javascript');
        fs.createReadStream(filePath).pipe(res);
    }
    else {
        console.log('file not found');
        res.status(400);
        res.end();
    }
}

exports.getStyleSheet = (req, res) => {
    const { auth, attribute, filename } = req.params;

    const filePath = getStyleSheetFilePath(auth, attribute, filename);
}