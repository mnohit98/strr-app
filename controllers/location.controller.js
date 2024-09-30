const db = require('../sql/dbOperations');
const axios = require('axios');

// Location Controller to save user location
exports.saveLocation = async (req, res) => {
  const { latitude, longitude } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    const addressComponents = response.data.results[0].address_components;
    
    let state = '', city = '', areaCode = '';

    addressComponents.forEach(component => {
      if (component.types.includes('administrative_area_level_1')) {
        state = component.long_name;
      }
      if (component.types.includes('locality')) {
        city = component.long_name;
      }
      if (component.types.includes('postal_code')) {
        areaCode = component.long_name;
      }
    });

    // Save location data (write your SQL query here to store the location in DB)
    res.status(200).json({ state, city, areaCode });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from Google API', error });
  }
};
