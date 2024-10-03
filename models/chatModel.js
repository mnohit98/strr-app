class SentChatMessage {
    constructor(memberId, clubId, messageText, sentAt) {
        this.memberId = memberId;
        this.clubId = clubId;
        this.messageText = messageText;
        this.sentAt = sentAt;
        this.validate();
    }

    validate() {
        if (!this.memberId || !this.messageText || !this.clubId || !this.sentAt) {
            throw new Error('All fields are required.');
        }
    }
}

class ChatHistoryRequest {
    constructor(clubId, sentBefore) {
        this.clubId = clubId;
        let dateOffset = (24*60*60) * 7;
        this.sentAfter = sentBefore - dateOffset;
        this.sentBefore = sentBefore;

    }
}

class ChatHistoryMessage {
    constructor(memberName,messageText,sentAt) {
        this.memberName = memberName;
        this.messageText = messageText;
        this.sentAt = sentAt;
        this.validate();
    }

    validate() {
        if (!this.memberName || !this.messageText || !this.sentAt) {
            throw new Error('All fields are required.');
        }
    }
}

module.exports = {
    ChatHistoryMessage, SentChatMessage, ChatHistoryRequest
}