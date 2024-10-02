const db = require('../config/db.config');
const userQueries = require('../queries/userQueries');

exports.findAdminById = (adminId) => {
    return new Promise((resolve, reject) => {
        db.query(userQueries.getAdminById, [adminId], (error, results) => {
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
