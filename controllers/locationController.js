const locationService = require('../services/locationService');
const { formatResponse, formatError } = require('../utils/responseFormatter');

exports.getAllLocation = async (req,res) => {
    try {
        const location = await locationService.getAllLocations();
        res.json(formatResponse(location));
    } catch (error) {
        res.status(500).json(formatError(error.message));
    }
};
