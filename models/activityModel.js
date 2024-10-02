class ActivityRequest {
    constructor(name, description, date, clubId, locationId) {
        this.name = name;
        this.description = description;
        this.date = new Date(date); // Ensure date is a Date object
        this.clubId = clubId;
        this.locationId = locationId;

        // Optional: Add validation checks
        this.validate();
    }

    validate() {
        if (!this.name || !this.description || !this.date || !this.clubId || !this.locationId) {
            throw new Error('All fields are required.');
        }
    }
}

class ActivityResponse {
    constructor(id, name, description, date, clubName, clubReputation) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.date = new Date(date); // Ensure date is a Date object
        this.clubName = clubName;
        this.clubReputation = clubReputation;
    }

    // Optional: Add a method to format the response
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            date: this.date,
            clubName: this.clubName,
            clubReputation: this.clubReputation,
        };
    }
}

module.exports = {
    ActivityRequest,
    ActivityResponse,
};
