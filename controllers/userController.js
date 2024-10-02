const userService = require('../services/userService.js');
const { formatResponse, formatError } = require('../utils/responseFormatter');

exports.getAdminDetails = async (req, res) => {
    try {
        const { adminId } = req.params;
        const adminDetails = await userService.getAdminDetails(adminId);
        res.json(formatResponse(adminDetails));
    } catch (error) {
        res.status(500).json(formatError(error.message));
    }
};

exports.getMemberDetails = async (req, res) => {
    try {
        const { memberId } = req.params;
        const memberDetails = await userService.getMemberDetails(memberId);
        res.json(formatResponse(memberDetails));
    } catch (error) {
        res.status(500).json(formatError(error.message));
    }
};

