const dbOps = require('../sql/dbOperations');

// Get Activity Tags by Location
exports.getActivityTags = async (req, res) => {
  const { locationId } = req.params;
  try {
    const activityTags = await dbOps.getActivityTagsByLocation(locationId);
    res.status(200).json(activityTags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity tags', error });
  }
};

// Get Activities by Location
exports.getAllActivities = async (req, res) => {
  const { locationId } = req.params;
  try {
    const activities = await dbOps.getActivitiesByLocation(locationId);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error });
  }
};

// Get Activities by Location and Tags
exports.getActivitiesByTags = async (req, res) => {
  const { locationId } = req.params;
  const { tagIds } = req.body;
  try {
    const activities = await dbOps.getActivitiesByTagsAndLocation(locationId, tagIds);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error });
  }
};

// Get Activity Details
exports.getActivityDetails = async (req, res) => {
  const { activityId } = req.params;
  try {
    const activityDetails = await dbOps.getActivityDetailsById(activityId);
    res.status(200).json(activityDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity details', error });
  }
};

// Post Feedback
exports.postFeedback = async (req, res) => {
  const { content, userId, activityId } = req.body;
  try {
    await dbOps.postFeedback(content, userId, activityId);
    res.status(201).json({ message: 'Feedback posted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error posting feedback', error });
  }
};
