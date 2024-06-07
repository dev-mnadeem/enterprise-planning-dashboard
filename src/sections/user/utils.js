export const TableHeadData = [
  { id: 'username', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'roel_id', label: 'Role' },
  { id: 'mobile_number', label: 'Mobile #' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

export const ADD_USER_INITIALS = {
  name: '',
  email: '',
  userRole: '',
  branch: '',
  phone_number: '',
  status: 'active',
  country: '',
  state: '',
  city: '',
  address: '',
  geo_location: '',
  location_ids: [],
};

export const ADD_SHIPMENT_INITIALS = {
  weight: 0,
};

export const filterArrayByValues = (objectsArray, valuesArray) => {
  return objectsArray?.filter((obj) => valuesArray?.includes(obj.value));
};
