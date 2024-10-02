const db = require('../config/db.config');
const locationQueries = require('../queries/locationQueries');

exports.findLocationByCoords = (latitude, longitude) => {
    return new Promise((resolve, reject) => {
        db.query(locationQueries.getLocationByCoords, [latitude, longitude], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

exports.insertLocation = (locationData) => {
    return new Promise((resolve, reject) => {
        db.query(locationQueries.addLocation, locationData, (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

exports.findActivityTagsByLocation = (locationId) => {
    return new Promise((resolve, reject) => {
        db.query(locationQueries.getActivityTagsByLocation, [locationId], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};
