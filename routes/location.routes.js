const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');

// API to save location data
router.post('/location', locationController.saveLocation);

module.exports = router;
