import * as Yup from 'yup';

const emailValidation = Yup.string().email('Invalid email').required('Email is required');
const passwordValidation = Yup.string()
  .min(8, 'Password must be at least 8 characters')
  .required('Password is required')
  .matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
    'Password must contain at least one letter, one number, and one special character'
  );

export const passwordUpdateSchema = Yup.object().shape({
  password: passwordValidation,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const signupSchema = Yup.object().shape({
  email: emailValidation,
  password: passwordValidation,
});

export const userFormValidationSchema = Yup.object().shape({
  name: Yup.string().required('User name is required'),
  email: emailValidation,
  userRole: Yup.string().required('User role is required'),
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  location_ids: Yup.array().of(Yup.string()).min(1, 'Please select at least one branch').nullable(),
});

export const userRoleFormValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Role name is required')
    .notOneOf(['admin'], "'admin' role is not allowed")
    .test(
      'not-admin-case-insensitive',
      'Role name cannot be "admin"',
      (value) => value.toLowerCase() !== 'admin'
    ),
});

export const createPackagingSchema = Yup.object().shape({
  name: Yup.string().required(),
  depth: Yup.number().optional().positive().min(0.01),
  width: Yup.number().optional().positive().min(0.01),
  height: Yup.number().optional().positive().min(0.01),
  weight_limit: Yup.number().optional().positive().min(0.0),
});

export const createPricingSchema = Yup.object().shape({
  from_city_id: Yup.string().required(),
  to_city_id: Yup.string().required(),
  price: Yup.number().required().positive().min(0.0),
  package_id: Yup.string().required(),
  is_fixed: Yup.boolean().required(),
});

export const createOrderSchema = Yup.object().shape({
  sender_name: Yup.string().required('Customer name is required'),
  sender_email: Yup.string().email().optional(),
  sender_phone: Yup.string().required('Customer phone number is required'),
  sender_address: Yup.string().required('Customer address is required'),
  receiver_name: Yup.string().required('Receiver name is required'),
  receiver_email: Yup.string().email().optional(),
  receiver_phone: Yup.string().required('Receiver phone number is required'),
  receiver_address: Yup.string().required('Receiver address is required'),
  payment_type: Yup.string().required('Payment type is required'),
  sender_city_id: Yup.string().required('Please select city'),
  receiver_city_id: Yup.string().required('Please select city'),
  shipping_date: Yup.date().required('Shipping date is required'),
  collection_time: Yup.date().required('Collection time is required'),
  location_id: Yup.string().required('Please select branch'),
  package_id: Yup.string().required('Please select package'),
  total_amount: Yup.number()
    .required('Total amount is required')
    .min(0.01, 'Weight must be greater than or equal to 0.01'),

  orderItems: Yup.array().of(
    Yup.object().shape({
      weight: Yup.number()
        .required('Weight is required')
        .min(0.01, 'Weight must be greater than or equal to 0.01'),
      quantity: Yup.number()
        .required('Quantity is required')
        .min(1, 'Quantity must be greater than or equal to 1'),
    })
  ),
});

export const shipmentInSchema = Yup.object().shape({
  location_id: Yup.string().required('Please select branch'),
  orderNo: Yup.string().required('Order number is required'),
});

export const shipmentOutSchema = Yup.object().shape({
  from_location_id: Yup.string().required(),
  to_location_id: Yup.string().required(),
  vehicle_id: Yup.string().required(),
});

export const createVehicleSchema = Yup.object().shape({
  name: Yup.string().required(),
  model: Yup.string().required(),
  registration_number: Yup.string().required(),
  driver_id: Yup.string().required(),
  vehicle_type_id: Yup.string().required(),
  status: Yup.string().required(),
});
