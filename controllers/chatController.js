const chatService = require('../services/chatService.js');
const { formatResponse, formatError } = require('../utils/responseFormatter');

const path = require('path');
const {ChatHistoryRequest, SentChatMessage} = require("../models/chatModel");

console.log('Resolved path:', path.resolve(__dirname, '../utils/responseFormatter'));

exports.getChatHistoryForClub = async (req, res) => {
    try {
        const { clubId, sentBefore } = req.body;
        const chatHistoryMessage = new ChatHistoryRequest(clubId, sentBefore);
        const activities = await chatService.getChatHistoryForClub(chatHistoryMessage);
        res.json(formatResponse(activities));
    } catch (error) {
        res.status(500).json(formatError(error.message));
    }
};

exports.broadcastChatMessageToClub = async (req, res) => {
    try {
        const { memberId, clubId, messageText } = req.body;
        const sentAt = (Date.now() - Date.now() % 1000)/1000;
        const sentChatMessage = new SentChatMessage(memberId, clubId, messageText, sentAt);
        res.json(formatResponse(await chatService.broadcastMessageToClub(sentChatMessage)));
    } catch (error) {
        res.status(500).json(formatError(error.message));
    }
};