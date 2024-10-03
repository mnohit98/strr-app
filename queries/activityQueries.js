exports.getActivitiesByLocation = `
    SELECT * FROM Activity
    WHERE location_id = ?
`;

exports.getActivityDetails = `
    SELECT a.*, c.name AS club_name, c.reputation AS club_reputation
    FROM Activity a
    JOIN Club c ON a.club_id = c.id
    WHERE a.id = ?
`;

exports.getUpcomingMeetupDetails = `
    SELECT 
        a.id AS activity_id,
        a.name AS activity_name,
        a.start_datetime,
        a.end_datetime,
        a.filled_seats,
        a.total_seats,
        a.venue,
        a.about,
        a.fee,
        a.payment_type,
        a.activity_photo_url,
        a.description,
        
        -- Club details
        c.id AS club_id,
        c.name AS club_name,
        c.reputation AS club_reputation,
        c.meetup_info,
        c.about,
        c.faqs,
        c.dp_url,
        c.admin_ids
        
    FROM Activity a
    JOIN Club c ON a.club_id = c.id
    WHERE c.id = ?;
`;