import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import ErrorMsg from '../error-msg';
import { Box, Button, Typography } from '@mui/material';
import { CustomDropdown, InputField } from '../common';
import { userFormValidationSchema } from 'src/constants';
import { ADD_USER_INITIALS } from 'src/sections/user/utils';
import { useLazyQuery, useQuery } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';
import PermissionsForm from '../permissions/form';
import {
  formateInitialPermissionsData,
  formattedPermissionsData,
  removeFalsePermissions,
} from 'src/utils';
import toast from 'react-hot-toast';
import _ from 'lodash';

export default function UserForm({ onSubmit, initials, buttonText }) {
  const [checkedPermissions, setCheckedPermissions] = useState({});
  const { data: userRoles, loading, error } = useQuery(ENDPOINTS.USER_ROLES);
  // const { data: countries, cntLoading, cntError } = useQuery(ENDPOINTS.COUNTRIES);
  const [getRolePermissions, { data: role, loading: rpLoading, error: rpError }] = useLazyQuery(
    ENDPOINTS.USER_ROLES
  );

  const userRoleOptions = userRoles?.map((role) => ({ value: role.id, label: role.name }));
  const initialValues = {
    userRole: userRoleOptions?.find((role) => role?.value === initials?.role_id)?.value,
    ...initials,
  };

  useEffect(() => {
    /** IF ACTION IS ADD, SET PERMISSIONS BASED ON SELECTED ROLE,
     * ELSE IF ACTION IS EDIT, SET PERMISSIONS BASED ON INITIALS */
    if (!initialValues?.userRole && role?.permissions?.length && _.isEmpty(checkedPermissions)) {
      const _initialPermissions = formateInitialPermissionsData(role?.permissions);
      setCheckedPermissions(_initialPermissions);
    } else if (initialValues?.userRole && _.isEmpty(checkedPermissions)) {
      const _initialPermissions = formateInitialPermissionsData(initialValues?.permissions);
      setCheckedPermissions(_initialPermissions);
    }
  }, [role?.permissions]);

  useEffect(() => {
    const _roleId = initialValues?.userRole;
    if (_roleId) {
      getRolePermissions({}, _roleId);
    }
  }, [initialValues?.userRole]);

  if (loading) return;
  if (error || rpError) return <div>{error || rpError}</div>;

  const accountStatusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const onSubmitForm = (values) => {
    const _permissions = formattedPermissionsData(checkedPermissions, role?.permissions);
    if (!_permissions?.length) {
      toast.error('Please select atleast one permission to create a User!');
      return;
    }

    onSubmit({ ...values, permissions: _permissions });
  };

  return (
    <Formik
      enableReinitialize={true}
      onSubmit={onSubmitForm}
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
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-10">
            <Box>
              <InputField
                name="name"
                title="Name"
                value={values.name}
                placeholder="Jhon Doe"
                onChange={handleChange}
              />
              {touched.name && errors?.name && <ErrorMsg error={errors.name} />}
            </Box>
            <Box>
              <InputField
                title="Email"
                placeholder="jhon@example.com"
                name="email"
                value={values.email}
                onChange={handleChange}
              />
              {touched.email && errors?.email && <ErrorMsg error={errors.email} />}
            </Box>
            <Box>
              <InputField
                title="Phone Number"
                placeholder="+1 123 456 7890"
                name="phone_number"
                value={values.phone_number}
                onChange={handleChange}
              />
              {touched.phone_number && errors?.phone_number && (
                <ErrorMsg error={errors.phone_number} />
              )}
            </Box>
            <Box>
              <InputField
                title="Address"
                placeholder="H # 123, Street # 2, NY"
                name="address"
                value={values.address}
                onChange={handleChange}
              />
              {touched.address && errors?.address && <ErrorMsg error={errors.address} />}
            </Box>

            <Box>
              <CustomDropdown
                name="status"
                title="Account Status"
                value={accountStatusOptions?.find((item) => item.value === values.status)}
                options={accountStatusOptions}
                placeholder="Select Account Status"
                onValueChange={(status) => {
                  setFieldTouched('status', true);
                  setFieldValue('status', status.value);
                }}
              />
              {touched.status && errors?.status && <ErrorMsg error={errors.status} />}
            </Box>

            <Box>
              <CustomDropdown
                name="branch"
                title="Working Branch"
                value={null}
                options={[]}
                placeholder="Select Branch"
                onValueChange={(branch) => {
                  setFieldTouched('branch', true);
                  setFieldValue('branch', branch.value);
                }}
              />
              {touched.branch && errors?.branch && <ErrorMsg error={errors.branch} />}
            </Box>

            <Box>
              <CustomDropdown
                title="Country"
                name="country"
                placeholder="Selet Country"
                options={[]}
                value={[].find((item) => item.value === values.country)}
                onValueChange={(value) => {
                  setFieldTouched('country', true);
                  setFieldValue('country', value.value);
                }}
              />
              {touched.country && errors?.country && <ErrorMsg error={errors.country} />}
            </Box>

            <Box>
              <CustomDropdown
                title="State"
                name="state"
                placeholder="Selet State"
                options={[]}
                value={[].find((item) => item.value === values.state)}
                onValueChange={(value) => {
                  setFieldTouched('state', true);
                  setFieldValue('state', value.value);
                }}
              />
              {touched.country && errors?.country && <ErrorMsg error={errors.country} />}
            </Box>

            <Box>
              <CustomDropdown
                title="City"
                name="city"
                placeholder="Selet City"
                options={[]}
                value={[].find((item) => item.value === values.city)}
                onValueChange={(value) => {
                  setFieldTouched('city', true);
                  setFieldValue('city', value.value);
                }}
              />
              {touched.city && errors?.city && <ErrorMsg error={errors.city} />}
            </Box>

            <Box>
              <CustomDropdown
                name="userRole"
                title="User Role"
                value={userRoleOptions?.find((item) => item.value === values.userRole)}
                options={userRoleOptions}
                placeholder="Select User Role"
                onValueChange={async (role) => {
                  setFieldTouched('userRole', true);
                  setFieldValue('userRole', role.value);
                  await getRolePermissions({}, role?.value);
                }}
              />
              {touched.userRole && errors?.userRole && <ErrorMsg error={errors.userRole} />}
            </Box>

            <Box className="col-span-2">
              <Typography variant="subtitle1">Permissions assigned to this role:</Typography>
              <Typography>You can also specify permissions for this user only</Typography>
              <PermissionsForm
                permissions={removeFalsePermissions(role?.permissions)}
                checkedPermissions={checkedPermissions}
                setCheckedPermissions={setCheckedPermissions}
              />
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
