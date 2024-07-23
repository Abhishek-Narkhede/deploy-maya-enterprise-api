const { default: axios } = require('axios');
const config = require('../config/config');
async function fetchLocationDetails(lat, long) {
    try {
        const latitude = lat ? lat : 19.095199584960938
        const longitude = long ? long : 74.74960327148438
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                latlng: `${latitude},${longitude}`,
                key: config.GOOGLE_MAPS_API,
            },
        });
        if (response.data.results && response.data.results.length > 0) {
            const addressComponents = response.data.results[0].address_components;

            // Initialize variables to store location details
            let formattedAddress = response.data.results[0].formatted_address;
            let city = null;
            let state = null;
            let country = null;
            let postalCode = null;

            addressComponents.forEach(component => {
                if (component.types.includes('locality')) {
                    city = component.long_name;
                } else if (component.types.includes('administrative_area_level_1')) {
                    state = component.long_name;
                } else if (component.types.includes('country')) {
                    country = component.long_name;
                } else if (component.types.includes('postal_code')) {
                    postalCode = component.long_name;
                }
            });

            return {
                formattedAddress,
                city,
                state,
                country,
                postalCode,
            };
        } else {
            console.log('No location found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching location:', error);
        return null;
    }
}

module.exports.fetchLocationDetails = fetchLocationDetails;