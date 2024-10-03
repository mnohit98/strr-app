const locationRepository = require('../repositories/locationRepository');

exports.getAllLocations = async () => {
    const locations = await locationRepository.findAllLocations();

    // Add the default location with id=0
    const defaultLocation = {
        id: 0,
        state: "ALL",
        city: "ALL",
        area: "ALL",
        area_code: "",
        latitude: 0.00,
        longitude: 0.00
    };

    // Add the default location at the beginning of the array
    locations.unshift(defaultLocation);

    return locations;
};