const express = require('express');
const router = express.Router();
const extraController = require('../controllers/extraController');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Achievements
router.get('/achievements', extraController.getAllAchievements);
router.post('/achievements/add', upload.single('image'), extraController.addAchievement);
router.delete('/achievements/:id', extraController.deleteAchievement);

// Settings
router.post('/settings/update', extraController.updateSettings);

module.exports = router;
