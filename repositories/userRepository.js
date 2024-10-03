const db = require('../config/db.config');
const userQueries = require('../queries/userQueries');

exports.findClubById = (memberId) => {
    return new Promise((resolve, reject) => {
        db.query(userQueries.getClubsByMemberId, [memberId], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

exports.findMemberById = (memberId) => {
    return new Promise((resolve, reject) => {
        db.query(userQueries.getMemberById, [memberId], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};