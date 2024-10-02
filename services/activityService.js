const activityRepository = require('../repositories/activityRepository');

exports.getActivitiesByLocation = async (locationId) => {
    return await activityRepository.findActivitiesByLocation(locationId);
};

exports.getActivityDetails = async (activityId) => {
    return await activityRepository.findActivityDetails(activityId);
};
