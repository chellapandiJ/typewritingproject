const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Student App Routes
router.post('/login', studentController.login);
router.post('/entry', studentController.entry);
router.post('/entry', studentController.entry);
router.post('/exit', studentController.exit);
router.get('/status', studentController.getStatus);

// Admin Routes for Student Management
router.get('/all', studentController.getAllStudents);
router.post('/create', studentController.createStudent);
router.put('/update/:id', studentController.updateStudent);
router.delete('/delete/:id', studentController.deleteStudent);

module.exports = router;
