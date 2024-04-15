const googlePlaceAutoComplete = (type) => {
  const initAutoComplete = async (input, callback) => {
    let autoComplete = new window.google.maps.places.Autocomplete(input, {
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
