const locationRepository = require('../repositories/locationRepository');

exports.getLocationByCoords = async (latitude, longitude) => {
    return await locationRepository.findLocationByCoords(latitude, longitude);
};

exports.addLocation = async (locationData) => {
    return await locationRepository.insertLocation(locationData);
};

exports.getActivityTagsByLocation = async (locationId) => {
    return await locationRepository.findActivityTagsByLocation(locationId);
};
