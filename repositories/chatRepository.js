const db = require('../config/db.config');
const chatQueries = require('../queries/chatQueries');
exports.getChatHistoryForClub = (chatHistoryRequest) => {
    return new Promise((resolve, reject) => {
        console.log(db.query(chatQueries.getChatHistoryForClub, [chatHistoryRequest.clubId, chatHistoryRequest.sentBefore, chatHistoryRequest.sentAfter]));
        db.query(chatQueries.getChatHistoryForClub, [chatHistoryRequest.clubId, chatHistoryRequest.sentBefore, chatHistoryRequest.sentAfter], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

exports.broadcastChatMessageToClub = (chatMessage) => {
    return new Promise((resolve, reject) => {
        db.query(chatQueries.broadcastChatMessageToClub, [chatMessage.memberId, chatMessage.clubId, chatMessage.messageText, chatMessage.sentAt ], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};
