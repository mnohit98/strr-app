const chatService = require('../services/chatService.js');
const { formatResponse, formatError } = require('../utils/responseFormatter');

const path = require('path');
console.log('Resolved path:', path.resolve(__dirname, '../utils/responseFormatter'));

exports.getChatHistoryForGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const activities = await chatService.getChatHistoryForGroup(groupId);
        res.json(formatResponse(activities));
    } catch (error) {
        res.status(500).json(formatError(error.message));
    }
};

exports.broadcastChatMessageToGroup = async (req, res) => {
    try {
        const { userId, groupId, } = req.params;
        const details = await chatService.broadcastChatMessageToGroup(activityId);
        res.json(formatResponse(details));
    } catch (error) {
        res.status(500).json(formatError(error.message));
    }
};