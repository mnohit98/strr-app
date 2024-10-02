exports.getLocationByCoords = `
    SELECT * FROM Location
    WHERE latitude BETWEEN ? - 0.01 AND ? + 0.01
    AND longitude BETWEEN ? - 0.01 AND ? + 0.01
`;

exports.addLocation = `
    INSERT INTO Location (state, city, area_code, latitude, longitude)
    VALUES (?, ?, ?, ?, ?)
`;

exports.getActivityTagsByLocation = `
    SELECT * FROM ActivityTag
    WHERE location_id = ?
`;
