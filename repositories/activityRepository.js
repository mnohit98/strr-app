const db = require('../config/db.config');
const activityQueries = require('../queries/activityQueries');

exports.findActivitiesByLocation = (locationId) => {
    return new Promise((resolve, reject) => {
        db.query(activityQueries.getActivitiesByLocation, [locationId], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

exports.findActivityDetails = (activityId) => {
    return new Promise((resolve, reject) => {
        db.query(activityQueries.getActivityDetails, [activityId], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};
