exports.getAdminById = `
    SELECT * FROM Admins
    WHERE id = ?
`;

exports.getMemberById = `
    SELECT * FROM Member
    WHERE id = ?
`;
