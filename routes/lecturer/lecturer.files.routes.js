/**
 * @module lecturerFileRoutes
 * serves course materials
 */

import express from 'express';
import path from 'path';
import fs from "fs";

const router = express.Router();
router.get('/courses/materials/:filename', (req, res) => {
    const filepath = path.join(__dirname, '..', '..', 'ITLE_FS', 'materials', req.params.filename);
    try {
        if (!fs.existsSync(filepath)) return res.status(404); //file not found

        return fs.createReadStream(filepath).pipe(res); //send file
    } catch (error) {
        console.log("Error Serving materials to lecturer: ", error);
        return res.status(500);//server error
    }
});

export default router;