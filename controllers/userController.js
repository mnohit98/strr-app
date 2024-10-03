const userService = require('../services/userService.js');
const { formatResponse, formatError } = require('../utils/responseFormatter');

exports.getClubsByMemberId = async (req, res) => {
    try {
        const { memberId } = req.params;
        const clubDetails = await userService.getClubsByMemberId(memberId);
        res.json(formatResponse(clubDetails));
    } catch (error) {
        res.status(500).json(formatError(error.message));
    }
};
