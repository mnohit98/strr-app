const chatRepository = require('../repositories/chatRepository');
const userService = require('./userService');
const {ChatHistoryMessage} = require("../models/chatModel");
exports.getChatHistoryForClub = async (chatHistoryMessage) => {
    return await chatRepository.getChatHistoryForClub(chatHistoryMessage);
};

exports.broadcastMessageToClub = async (sentChatMessage) => {
    await chatRepository.broadcastChatMessageToClub(sentChatMessage);
    const memberDetails = (await userService.getMemberDetails(sentChatMessage.memberId))[0];
    return new ChatHistoryMessage(memberDetails.name, sentChatMessage.messageText, sentChatMessage.sentAt);
};
