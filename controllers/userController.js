const userService = require('../services/userService.js');
const { formatResponse, formatError } = require('../utils/responseFormatter');

exports.getClubsByMemberId = async (req, res) => {
    try {
        const clubDetails = await userService.getClubsByMemberId(req.member_id.userId);
        res.json(formatResponse(clubDetails));
    } catch (error) {
        res.status(500).json(formatError(error.message));
    }
};

exports.getMemberDetails = async (req, res) => {
    try {
        const clubDetails = await userService.getMemberDetails(req.member_id.userId);
        res.json(formatResponse(clubDetails));
    } catch (error) {
        res.status(500).json(formatError(error.message));
    }
};