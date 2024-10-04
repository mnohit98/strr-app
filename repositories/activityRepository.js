const db = require('../config/db.config');
const activityQueries = require('../queries/activityQueries');

exports.findUpcomingMeetups = (clubId) => {
    return new Promise((resolve, reject) => {
        db.query(activityQueries.getUpcomingMeetupDetails, [clubId], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

exports.findAdminsByAdminIds = (adminIds) => {
    
    return new Promise((resolve, reject) => {
        if (!Array.isArray(adminIds) || adminIds.length === 0) {
            return resolve([]);
        }

        const query = `
            SELECT id, name, email, contact_number, whatsapp_number, reputation
            FROM Admins
            WHERE id IN (?)
        `;

        db.query(query, [adminIds], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};


exports.findMembersByActivityId = (activityId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT m.id, m.name, m.email
            FROM Activity_Member am
            JOIN Member m ON am.member_id = m.id
            WHERE am.activity_id = ?
        `;
        db.query(query, [activityId], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

exports.findClubById = (clubId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Club WHERE id = ?`;
    db.query(query, [clubId], (error, results) => {
      if (error) return reject(error);
      resolve(results[0]); // Return the club object
    });
  });
};

exports.getAdminsByIds = (adminIds) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Admins WHERE id IN (?)`;
    db.query(query, [adminIds], (error, results) => {
      if (error) return reject(error);
      resolve(results); // Return the list of admins
    });
  });
};

exports.getMembersByClubId = (clubId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Club_Member WHERE club_id = ?`;
    db.query(query, [clubId], (error, results) => {
      if (error) return reject(error);
      resolve(results); // Return the list of members
    });
  });
};

exports.getMemberDetails = (memberIds) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Member WHERE id IN (?)`;
    db.query(query, [memberIds], (error, results) => {
      if (error) return reject(error);
      resolve(results); // Return the list of members
    });
  });
};

exports.getActivityTag = (tagId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ActivityTag WHERE id = ?`;
    db.query(query, [tagId], (error, results) => {
      if (error) return reject(error);
      resolve(results); // Return the list of members
    });
  });
};

exports.findClubsByLocation = (locationId) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT id,name,reputation,dp_url,activity_tag_id,about,location_id,meetup_info,m_count FROM Club WHERE location_id = ?`;
    if(locationId == 0)
    {
        query = `SELECT id,name,reputation,dp_url,activity_tag_id,about,location_id,meetup_info,m_count  FROM Club`;
    }
    db.query(query, [locationId], (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

exports.getActivityTagById = (activityTagId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ActivityTag WHERE id = ?`;
    db.query(query, [activityTagId], (error, results) => {
      if (error) return reject(error);
      resolve(results[0]);
    });
  });
};

exports.findActivityTags = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ActivityTag`;
    db.query(query, (error, results) => {
      if (error) return reject(error);
      resolve(results); 
    });
  });
};