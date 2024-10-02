const userRepository = require('../repositories/userRepository');

exports.getAdminDetails = async (adminId) => {
    return await userRepository.findAdminById(adminId);
};

exports.getMemberDetails = async (memberId) => {
    return await userRepository.findMemberById(memberId);
};
