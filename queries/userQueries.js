exports.getClubsByMemberId = `
    SELECT
        Club.id AS club_id,
        Club.name AS club_name,
        Club.reputation,
        Club.meetup_places,
        Club.meetup_timings,
        Club.faqs,
        Club.dp_url,
        Club.activity_tag_id
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

