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
  username: Yup.string().required('User name is required'),
  email: emailValidation,
  userRole: Yup.string().required('User role is required'),
});
