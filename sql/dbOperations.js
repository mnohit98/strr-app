const db = require('../config/db.config');

// Get Activity Tags by Location
exports.getActivityTagsByLocation = async (locationId) => {
  const query = `SELECT * FROM ActivityTag WHERE location_id = ?`;
  const [rows] = await db.execute(query, [locationId]);
  return rows;
};

// Get Activities by Location
exports.getActivitiesByLocation = async (locationId) => {
  const query = `SELECT * FROM Activity WHERE location_id = ?`;
  const [rows] = await db.execute(query, [locationId]);
  return rows;
};

// Get Activities by Tags and Location
exports.getActivitiesByTagsAndLocation = async (locationId, tagIds) => {
  const query = `SELECT * FROM Activity WHERE location_id = ? AND tag_id IN (?)`;
  const [rows] = await db.execute(query, [locationId, tagIds]);
  return rows;
};

// Get Activity Details by ID
exports.getActivityDetailsById = async (activityId) => {
  const query = `SELECT * FROM Activity WHERE id = ?`;
  const [rows] = await db.execute(query, [activityId]);
  return rows;
};

// Get Club Members by Club ID
exports.getClubMembersByClubId = async (clubId) => {
  const query = `SELECT * FROM Member WHERE club_id = ?`;
  const [rows] = await db.execute(query, [clubId]);
  return rows;
};

// Post Feedback
exports.postFeedback = async (content, userId, activityId) => {
  const query = `INSERT INTO Feedback (content, user_id, activity_id) VALUES (?, ?, ?)`;
  const [result] = await db.execute(query, [content, userId, activityId]);
  return result;
};

// Get Activity Group Enum
exports.getActivityGroups = async () => {
  const query = `SELECT DISTINCT activity_group FROM ActivityTag`;
  const [rows] = await db.execute(query);
  return rows;
};
