const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router.get('/all', testController.getAllTests);
router.get('/active', testController.getActiveTests);
router.post('/create', testController.createTest);
router.delete('/delete/:id', testController.deleteTest);

router.post('/submit', testController.submitResult);
router.get('/results/:test_id', testController.getTestResults);
router.get('/:id', testController.getTestDetails);
router.get('/student-results/:student_id', testController.getStudentResults);

module.exports = router;
