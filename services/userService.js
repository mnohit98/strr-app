const userRepository = require('../repositories/userRepository');

exports.getClubsByMemberId = async (memberId) => {
    return await userRepository.findClubById(memberId);
};

exports.getMemberDetails = async (memberId) => {
    return await userRepository.findMemberById(memberId);
};