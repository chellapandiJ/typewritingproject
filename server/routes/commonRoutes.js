const express = require('express');
const router = express.Router();
const commonController = require('../controllers/commonController');

// Machines
router.get('/machines', commonController.getAllMachines);
router.post('/machines/add', commonController.addMachine);
router.delete('/machines/delete/:id', commonController.deleteMachine);
router.put('/machines/status/:id', commonController.updateMachineStatus);
// router.get('/machines/slots', commonController.getMachineSlots); // Not implemented yet

// Dashboard Stats
router.get('/stats', commonController.getStats);

// Batches
router.get('/batches', commonController.getBatches);
router.post('/batches/add', commonController.addBatch);

// Announcements
router.get('/announcements', commonController.getAnnouncements);
router.post('/announcements/add', commonController.addAnnouncement);
router.delete('/announcements/:id', commonController.deleteAnnouncement);

// Settings
router.get('/settings', commonController.getSettings);
router.post('/settings/update', commonController.updateSettings);

// Reports
router.get('/attendance/monthly', commonController.getMonthlyReport);

module.exports = router;
