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

exports.getActivityDetails
