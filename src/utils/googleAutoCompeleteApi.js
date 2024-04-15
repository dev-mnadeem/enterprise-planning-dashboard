let placesLibrary;

// Loads the Maps JS API once, on first use, and only when a key is configured.
// It used to be a static <script> in index.html that loaded even with an empty
// key and named a callback (initMap) that did not exist.
export const loadPlacesLibrary = () => {
  const key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  if (!key) return Promise.resolve(null);
  if (window.google?.maps?.places) return Promise.resolve(window.google);
  if (!placesLibrary) {
    placesLibrary = new Promise((resolve, reject) => {
      window.__onGoogleMapsReady = () => resolve(window.google);
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
        key
      )}&loading=async&libraries=places&callback=__onGoogleMapsReady`;
      script.async = true;
      script.onerror = () => {
        placesLibrary = undefined;
        reject(new Error('Google Maps failed to load'));
      };
      document.head.appendChild(script);
    });
  }
  return placesLibrary;
};

const googlePlaceAutoComplete = () => {
  const initAutoComplete = async (input, callback) => {
    const google = await loadPlacesLibrary();
    if (!google || !input) return undefined;
    const autoComplete = new google.maps.places.Autocomplete(input, {
      fields: ['address_components', 'name', 'formatted_address', 'place_id', 'geometry'],
      libraries: ['places', 'city'],
      language: 'en',
      strictBounds: true,
    });
    autoComplete.addListener('place_changed', callback);
    return autoComplete;
  };

  const parseAddress = (place) => {
    const result = {};
    for (var i = 0; i < place.length; i++) {
      const ac = place[i];
      result[ac.types[0]] = ac.short_name;
    }
    return result;
  };

  const setAddressFields = (address) => {
    return {
      address_line_1: `${address?.street_number || ''} ${address?.route || ''}`.trim(),
      address_line_2: address.subpremise,
      city: address.locality,
      state: address.administrative_area_level_1,
      zip: address.postal_code,
      country: address.country,
    };
  };

  const getParsedAddress = (payload) => {
    let autocompleteAddress = '';
    autocompleteAddress = (payload.address_line_1 ?? '') + ' ';
    return autocompleteAddress;
  };

  const getFullAddress = async (autoComplete) => {
    const place = await autoComplete.getPlace();
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = parseAddress(place.address_components);
    const fields = setAddressFields(address);
    const parsedAdd = getParsedAddress(fields);
    return {
      fields,
      parsedAdd,
      address,
      formattedAddress: place.formatted_address,
      name: place?.name ?? '',
      place_id: place?.place_id ?? '',
      geo_location: `${lat} ${lng}`,
    };
  };

  return {
    initAutoComplete,
    getFullAddress,
  };
};

export default googlePlaceAutoComplete;
