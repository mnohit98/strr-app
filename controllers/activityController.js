const activityService = require('../services/activityService.js');
const { formatResponse, formatError } = require('../utils/responseFormatter');

exports.getUpcomingMeetups = async (req, res) => {
    try {
        const { clubId } = req.params;
        const meetups = await activityService.getUpcomingMeetups(clubId);
        res.json(formatResponse(meetups));
    } catch (error) {
        res.status(500).json(formatError(error.message));
    }
};

exports.getClubInfo = async (req, res) => {
    const { clubId } = req.params;
    try {
      const clubInfo = await activityService.getClubInfo(clubId);
      res.status(200).json(clubInfo);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
};

// if locationId equal to zero get all clubs
exports.getClubsByLocation = async (req, res) => {
  const locationId = req.params.locationId;

  try {
    const clubs = await activityService.getClubsByLocation(locationId);
    res.status(200).json(clubs); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActivityTags = async (req, res) => {
  try {
    const clubs = await activityService.getActivityTags();
    res.status(200).json(clubs); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
