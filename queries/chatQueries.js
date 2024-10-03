exports.getChatHistoryForClub = `
    SELECT message_id, member_id, name, message_text, sent_at FROM Chat c
    inner join member m on c.member_id = m.id
    WHERE club_id = ? and sent_at < FROM_UNIXTIME(?) and sent_at > FROM_UNIXTIME(?) order by sent_at desc 
`;

exports.broadcastChatMessageToClub = `
    INSERT INTO Chat (member_id, club_id, message_text, sent_at)
    VALUES (?,?,?,FROM_UNIXTIME(?));
`;