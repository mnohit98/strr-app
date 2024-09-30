const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');

// APIs for activities
router.get('/activities/tags/:locationId', activityController.getActivityTags);
router.get('/activities/:locationId', activityController.getAllActivities);
router.post('/activities/:locationId', activityController.getActivitiesByTags);
router.get('/activity/details/:activityId', activityController.getActivityDetails);
router.post('/feedback', activityController.postFeedback);

module.exports = router;
