import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import ErrorMsg from '../error-msg';
import { Box, Button, Typography } from '@mui/material';
import { InputField } from '../common';
import { userRoleFormValidationSchema } from 'src/constants';
import { useQuery } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';
import { ADD_ROLE_INITIALS } from 'src/sections/roles/utils';
import PermissionsForm from '../permissions/form';
import toast from 'react-hot-toast';
import { formateInitialPermissionsData, formattedPermissionsData } from 'src/utils';
import _ from 'lodash';

export default function UserRoleForm({ onSubmit, initials, viewOnly, buttonText }) {
  const [checkedPermissions, setCheckedPermissions] = useState({});
  const { data: permissions, loading, error } = useQuery(ENDPOINTS.PERMISSIONS);

  useEffect(() => {
    if (initials?.permissions?.length && _.isEmpty()) {
      const _initialPermissions = formateInitialPermissionsData(initials?.permissions);
      setCheckedPermissions(_initialPermissions);
    }
  }, []);

  if (loading) return;
  if (error) return <>Error</>;

  const initialValues = {
    ...initials,
  };

  const onSubmitForm = (values) => {
    const _permissions = formattedPermissionsData(checkedPermissions, permissions);
    if (!_permissions?.length) {
      toast.error('Please select atleast one permission to create a User Role!');
      return;
    }

    onSubmit({ ...values, permissions: _permissions });
  };

  return (
    <Formik
      enableReinitialize
      onSubmit={onSubmitForm}
      validationSchema={userRoleFormValidationSchema}
      initialValues={initials ? initialValues : ADD_ROLE_INITIALS}
    >
      {({
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        values,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <fieldset disabled={viewOnly ?? false}>
            <div className="grid gap-4 grid-cols-1 mt-10">
              <Box>
                <InputField
                  name="name"
                  title="Role Name"
                  value={values.name}
                  placeholder="Enter name i.e Manager"
                  onChange={handleChange}
                />
                {touched.name && errors?.name && <ErrorMsg error={errors.name} />}
              </Box>

              <Typography className="font-semibold	">
                {viewOnly
                  ? 'Permissions assigned to this role'
                  : 'Select Permissions to assign this role'}
              </Typography>
              <PermissionsForm
                permissions={permissions}
                checkedPermissions={checkedPermissions}
                setCheckedPermissions={setCheckedPermissions}
              />
            </div>
            {viewOnly ? null : (
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
            )}
          </fieldset>
        </form>
      )}
    </Formik>
  );
}
