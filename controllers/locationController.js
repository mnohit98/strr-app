const locationService = require('../services/locationService');
const { formatResponse, formatError } = require('../utils/responseFormatter');


exports.getLocationByCoords = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const location = await locationService.getLocationByCoords(latitude, longitude);
        res.json(formatResponse(location));
    } catch (error) {
        res.status(500).json(formatError(error.message));
    }
};

exports.addLocation = async (req, res) => {
    try {
        const locationData = req.body;
        const result = await locationService.addLocation(locationData);
        res.status(201).json(formatResponse(result, "Location added successfully"));
    } catch (error) {
        res.status(500).json(formatError(error.message));
    }
};

exports.getActivityTagsByLocation = async (req, res) => {
    try {
        const { locationId } = req.params;
        const tags = await locationService.getActivityTagsByLocation(locationId);
        res.json(formatResponse(tags));
    } catch (error) {
        res.status(500).json(formatError(error.message));
    }
};
