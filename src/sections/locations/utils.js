import * as Yup from 'yup';

export const TableHeadData = [
  { id: 'name', label: 'Name' },
  { id: 'city', label: 'City' },
  { id: 'location_type', label: 'Location Type', align: 'center' },
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
  state: '',
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
