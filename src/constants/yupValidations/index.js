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
  depth: Yup.number().required().positive().min(0.01),
  width: Yup.number().required().positive().min(0.01),
  height: Yup.number().required().positive().min(0.01),
  price: Yup.number().required().positive().min(0.0),
  weight_limit: Yup.number().optional().positive().min(0.0),
});

const createShipmentItemSchema = Yup.object().shape({
  description: Yup.string().optional(),
  courier_type: Yup.string().optional(),
  quantity: Yup.number().required().positive().integer(),
  price: Yup.number().required().positive(),
  weight: Yup.string().required(),
  weight_type: Yup.string().required(),
  length: Yup.number().required().positive(),
  width: Yup.number().required().positive(),
  height: Yup.number().required().positive(),
  total_price: Yup.number().required().positive(),
});

const createShipmentSchema = Yup.object().shape({
  user_id: Yup.string().required(),
  order_number: Yup.string().required(),
  sender_name: Yup.string().required(),
  sender_email: Yup.string().email().optional(),
  sender_phone: Yup.string().required(),
  sender_address: Yup.string().required(),
  sender_city: Yup.string().required(),
  receiver_name: Yup.string().required(),
  receiver_email: Yup.string().email().optional(),
  receiver_phone: Yup.string().required(),
  receiver_address: Yup.string().required(),
  receiver_city: Yup.string().required(),
  total_quantity: Yup.number().required().positive().integer(),
  sub_total: Yup.number().required().positive(),
  discount: Yup.number().required().positive(),
  total_amount: Yup.number().required().positive(),
  payment_type: Yup.string().required(),
  payment_status: Yup.string().required(),
  payment_date: Yup.date().required(),
  orderItems: Yup.array().of(createShipmentItemSchema).required(),
});
