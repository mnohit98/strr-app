const activityService = require('../services/activityService.js');
const { formatResponse, formatError } = require('../utils/responseFormatter');

const path = require('path');
console.log('Resolved path:', path.resolve(__dirname, '../utils/responseFormatter'));

exports.getActivitiesByLocation = async (req, res) => {
    try {
        const { locationId } = req.params;
        const activities = await activityService.getActivitiesByLocation(locationId);
        res.json(formatResponse(activities));
    } catch (error) {
        res.status(500).json(formatError(error.message));
    }
};

exports.getActivityDetails = async (req, res) => {
    try {
        const { activityId } = req.params;
        const details = await activityService.getActivityDetails(activityId);
        res.json(formatResponse(details));
    } catch (error) {
        res.status(500).json(formatError(error.message));
    }
};