import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

import { runCreateClasses } from '../../controllers/admin/class.controller.js';
import { verifyAdmin } from './router.utils.js';
import Resource from '../../models/courses/resources.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const library = multer({
    dest: path.join(__dirname, '..', '..', 'public', 'assets', 'library')
});

const router = express.Router();
router.get('/admin/classes/create/:id', verifyAdmin, runCreateClasses);

router.post('/library/add', library.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]), async (req, res) => {

    const { title, author, year, faculty, type } = req.body;

    try {
        // Save the details to the database
        const resource = new Resource({
            title,
            author,
            year,
            faculty,
            type,
            thumbnail: req.files['thumbnail'][0].filename,
            file: req.files['file'][0].filename
        });

        await resource.save();

        res.status(200).send({
            message: 'Resource uploaded successfully!',
            data: resource
        });
    } catch (error) {
        res.status(500).send({
            message: 'Failed to upload resource',
            error: error.message
        });
    }
});
router.get('/library/get', async (req, res) => {
    const { type } = req.query;

    try {
        // Fetch resources from the database based on the type query parameter
        const resources = await Resource.find(type ? { type } : {});

        if (resources.length === 0) {
            return res.status(404).send({
                message: 'No resources found',
                data: []
            });
        }

        res.status(200).send({
            message: 'Resources fetched successfully',
            data: resources
        });
    } catch (error) {
        res.status(500).send({
            message: 'Failed to fetch resources',
            error: error.message
        });
    }
});

export default router;