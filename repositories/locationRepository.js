const db = require('../config/db.config');

exports.findAllLocations = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Location`;
    db.query(query, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};
