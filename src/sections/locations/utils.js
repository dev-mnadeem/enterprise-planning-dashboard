import * as Yup from 'yup';

export const TableHeadData = [
  { id: 'name', label: 'Name' },
  { id: 'country', label: 'Country' },
  { id: 'city', label: 'City' },
  { id: 'location_tyoe', label: 'Location Type', align: 'center' },
  { id: 'address', label: 'Address' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

export const LocationDummy = [
  {
    id: 1,
    name: 'Test Location',
    city: 'Lahore',
    geoLocation: '10321,123123',
    status: 'active',
    address: 'Abc Steet, Kalma chowk, Lahore',
    country: 'Pakistan',
    locationType: 'Warehouse',
  },
  {
    id: 2,
    name: 'Test Location 2',
    city: 'Lahore',
    geoLocation: '10321,123123',
    status: 'active',
    address: 'Abcd Steet, Kalma chowk, Lahore',
    country: 'Pakistan',
    locationType: 'Branch',
  },
  {
    id: 3,
    name: 'Test Location 3',
    city: 'Lahore',
    geoLocation: '10321123.123,123123123',
    status: 'banned',
    address: 'Abc Steet, Kalma chowk, Lahore',
    country: 'Pakistan',
    locationType: 'Franchise',
  },
  {
    id: 4,
    name: 'Test Location 4',
    city: 'Lahore',
    geoLocation: '10321,123123',
    status: 'active',
    address: 'Abc Steet4, Kalma chowk, Lahore',
    country: 'Pakistan',
    locationType: 'Franchise',
  },
  {
    id: 5,
    name: 'Test Location 5',
    city: 'Lahore',
    geoLocation: '10321,123123',
    status: 'banned',
    address: 'Abc Steet, Kalma chowk, Lahore',
    country: 'Pakistan',
    locationType: 'Warehouse',
  },
];

export const locationValidationSchema = Yup.object().shape({
  city: Yup.string().required('City is required'),
  status: Yup.string().required('Status is required'),
  address: Yup.string().required('address is required'),
  country: Yup.string().required('Country is required'),
  name: Yup.string().required('Location Name is required'),
  locationType: Yup.string().required('Location type is required'),
  geoLocation: Yup.string().required('Location type is required'),
});

export const ADD_LOCATION_INITIALS = {
  name: '',
  city: '',
  status: '',
  address: '',
  country: '',
  geoLocation: '213123.12312, 41212412.214',
  locationType: '',
};

export const LocationTypes = [
  {
    label: 'Warehouse',
    value: 'Warehouse',
  },
  {
    label: 'Branch',
    value: 'Branch',
  },
  {
    label: 'Franchise',
    value: 'Franchise',
  },
];

export const LocationStatus = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Banned',
    value: 'banned',
  },
];

export const Countries = [
  {
    label: 'Pakistan',
    value: 'Pakistan',
  },
];

export const Cities = [
  {
    label: 'Lahore',
    value: 'Lahore',
  },
  {
    label: 'Karachi',
    value: 'Karachi',
  },
  {
    label: 'Islamabad',
    value: 'Islamabad',
  },
  {
    label: 'Multan',
    value: 'Multan',
  },
  {
    label: 'Faisalabad',
    value: 'Faisalabad',
  },
];
