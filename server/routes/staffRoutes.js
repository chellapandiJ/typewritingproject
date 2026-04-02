const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

router.get('/all', staffController.getAllStaff);
router.post('/create', staffController.createStaff);
router.put('/update/:id', staffController.updateStaff);
router.delete('/delete/:id', staffController.deleteStaff);

module.exports = router;
