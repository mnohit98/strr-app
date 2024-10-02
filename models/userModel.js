class UserResponse {
    constructor(id, name, email, contact, whatsapp, reputation) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.contact = contact;
        this.whatsapp = whatsapp;
        this.reputation = reputation;
    }
}

module.exports = {
    UserResponse,
};
