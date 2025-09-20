const express = require('express');
const multer = require('multer');
const path = require('path');
const { importMedicalCodes } = require('../utils/csvImporter');

const router = express.Router();

// Configure multer for CSV file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, 'medical_codes_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname) !== '.csv') {
            return cb(new Error('Only CSV files are allowed'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size is too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ error: err.message });
    } else if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
};

// POST endpoint for CSV upload
router.post('/upload', handleMulterError, upload.single('file'), async (req, res) => {
    try {
        console.log('Received file upload request');
        console.log('Request file:', req.file);
        
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (!req.file.path) {
            return res.status(400).json({ error: 'File path is missing' });
        }

        console.log('Processing file:', req.file.path);
        const { results, errors } = await importMedicalCodes(req.file.path);
        console.log(`Processed ${results.length} records with ${errors.length} errors`);

        res.json({
            success: true,
            message: `Processed ${results.length} records`,
            errors: errors.length > 0 ? errors : undefined,
            summary: {
                total: results.length,
                errors: errors.length,
                categories: [...new Set(results.map(r => r.category))],
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error processing CSV:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET endpoint to retrieve import history
router.get('/history', (req, res) => {
    // TODO: Implement import history tracking
    res.json({ message: 'Import history endpoint' });
});

module.exports = router;