exports.getClubsByMemberId = `
    SELECT
        Club.id AS club_id,
        Club.name AS club_name,
        Club.dp_url
    FROM
        Club
    JOIN
        Club_Member ON Club.id = Club_Member.club_id
    WHERE
        Club_Member.member_id = ?;
`;

exports.addMemberToClub = `
    INSERT INTO Club_Member (club_id, member_id)
    VALUES (?, ?);
`;

exports.getMemberById = `
    SELECT * FROM Member
    WHERE id = ?
`;