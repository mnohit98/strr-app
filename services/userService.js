const userRepository = require('../repositories/userRepository');

exports.getClubsByMemberId = async (memberId) => {
    return await userRepository.findClubById(memberId);
};

