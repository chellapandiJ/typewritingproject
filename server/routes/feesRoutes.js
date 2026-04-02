const express = require('express');
const router = express.Router();
const feesController = require('../controllers/feesController');

router.get('/student/:student_id', feesController.getStudentFees);
router.get('/pending', feesController.getPendingFees);
router.post('/add', feesController.addFee);
router.get('/daily', feesController.getDailyReport);

module.exports = router;
