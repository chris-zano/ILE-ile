const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require("fs");

router.get('/courses/materials/:filename', (req, res) => {
    const filepath = path.join(__dirname, '..', '..', 'ITLE_FS', 'materials', req.params.filename);
    fs.createReadStream(filepath).pipe(res);
})



module.exports = router;