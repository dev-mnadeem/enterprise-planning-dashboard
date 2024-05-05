import React from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import ErrorMsg from '../error-msg';
import { Box, Button } from '@mui/material';
import { CustomDropdown, InputField } from '../common';
import { userFormValidationSchema } from 'src/constants';
import { ADD_USER_INITIALS } from 'src/sections/user/utils';
import { useQuery } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';

export default function UserForm({ onSubmit, initials, buttonText }) {
  const { data: userRoles, loading, error } = useQuery(ENDPOINTS.USER_ROLES);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  const userRoleOptions = userRoles?.map((role) => ({ value: role.id, label: role.name }));
  const initialValues = {
    userRole: userRoleOptions?.find((role) => role?.value === initials?.role_id)?.value,
    ...initials,
  };

  return (
    <Formik
      enableReinitialize
      onSubmit={onSubmit}
      validationSchema={userFormValidationSchema}
      initialValues={initials ? initialValues : ADD_USER_INITIALS}
    >
      {({
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        values,
      }) => (
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 grid-cols-2 mt-10">
            <Box>
              <InputField
                name="username"
                title="Name"
                value={values.username}
                placeholder="Enter name"
                onChange={handleChange}
              />
              {touched.username && errors?.username && <ErrorMsg error={errors.username} />}
            </Box>
            <Box>
              <InputField
                title="Email"
                placeholder="Enter Email"
                name="email"
                value={values.email}
                onChange={handleChange}
              />
              {touched.email && errors?.email && <ErrorMsg error={errors.email} />}
            </Box>
            <Box>
              <CustomDropdown
                name="userRole"
                title="User Role"
                value={userRoleOptions?.find((item) => item.value === values.userRole)}
                options={userRoleOptions}
                placeholder="Selet User Role"
                onValueChange={(role) => {
                  setFieldTouched('userRole', true);
                  setFieldValue('userRole', role.value);
                }}
              />
              {touched.userRole && errors?.userRole && <ErrorMsg error={errors.userRole} />}
            </Box>
          </div>
          <Button
            type="submit"
            variant="contained"
            color="inherit"
            sx={{
              display: 'flex',
              padding: '10px 16px',
              marginTop: '15px',
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
            }}
          >
            {buttonText}
          </Button>
        </form>
      )}
    </Formik>
  );
}

UserForm.propTypes = {
  onSubmit: PropTypes.func,
  initials: PropTypes.object,
};
