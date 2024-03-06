const path = require('path');
const fs = require('fs');

function setFilePath(mimeType, attribute, authFolder, filename) {
    const resolvedpath = path.join(__dirname, '..', '..', 'public', `${mimeType}`, `${attribute}`, `${authFolder}`, `${filename}.js`);
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

exports.loadScript = (req, res) => {
    if (req.params.filename == 'login') {
        //do not authenticate the request
        //log req.ip
        const { auth, filename } = req.params;
        
        const filePath = getScriptFilePath('scripts', auth, filename);

        console.log(filePath);
        if (filePath != 'not found') {
            console.log(filePath);
            res.type('text/javascript');
            fs.createReadStream(filePath).pipe(res);
        }
        else {
            console.log('file not found');
            res.status(400);
            res.end();
        }
    }
}

exports.loadUtilityScript = (req, res) => {
    const { auth, filename } = req.params;

    const filePath = getScriptFilePath('utils', auth, filename);

    console.log(filePath);
        if (filePath != 'not found') {
            console.log(filePath);
            res.type('text/javascript');
            fs.createReadStream(filePath).pipe(res);
        }
        else {
            console.log('file not found');
            res.status(400);
            res.end();
        }
}