import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import ErrorMsg from '../error-msg';
import { Box, Button, Card, Typography } from '@mui/material';
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

export default function UserForm({ onSubmit, initials = {}, viewOnly, buttonText }) {
  const [initialValues, setInitialValues] = useState({ ...initials });
  const [checkedPermissions, setCheckedPermissions] = useState({});
  const { data: userRoles, loading, error } = useQuery(ENDPOINTS.USER_ROLES);
  const { data: countries, cntLoading, cntError } = useQuery(ENDPOINTS.COUNTRIES);
  const [getRolePermissions, { data: role, loading: rpLoading, error: rpError }] = useLazyQuery(
    ENDPOINTS.USER_ROLES
  );
  const [fetchCountryStates, { data: states, error: stError }] = useLazyQuery(ENDPOINTS.COUNTRIES);
  const [fetchStateCities, { data: cities, error: citiesError }] = useLazyQuery(ENDPOINTS.STATES);
  const [fetchCity, { data: city, error: cityError }] = useLazyQuery(ENDPOINTS.CITIES);
  const [fetchState, { data: state, error: stateError }] = useLazyQuery(ENDPOINTS.STATES);

  const userRoleOptions = userRoles?.map((role) => ({ value: role.id, label: role.name }));
  const countriesOptions = countries?.map((country) => ({
    value: country.id,
    label: country.name,
  }));
  const stateOptions = states?.map((state) => ({ value: state.id, label: state.name }));
  const cityOptions = cities?.map((city) => ({ value: city.id, label: city.name }));

  const {
    error:LocationError,
    loading:locationLoading,
    data: locations,
  } = useQuery(ENDPOINTS.LOCATIONS);

  const locationOptions = locations?.map((location) => ({
    value: location.id,
    label: location.name,
  }));


  useEffect(() => {
    if (initials?.role_id) {
      setInitialValues({
        ...initialValues,
        userRole: initials?.role_id,
      });
    }
  }, [initials?.role_id]);

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

  useEffect(() => {
    /** FETCH STATE, CITY AND COUNTRY DATA BASED ON INITIALS CITY ID */
    const _cityId = initialValues?.city_id;
    if (_cityId && countries?.length) {
      fetchCity({}, _cityId).then((_city) => {
        fetchState({}, _city?.state_id).then((_state) => {
          fetchCountryStates({}, `${_state?.country_id}/${ENDPOINTS.STATES}`).then(() => {
            fetchStateCities({}, `${_city?.state_id}/${ENDPOINTS.CITIES}`).then(() => {
              setInitialValues({
                ...initialValues,
                country: _state?.country_id,
                state: _city?.state_id,
                city: _city?.id,
              });
            });
          });
        });
      });
    }
  }, [initialValues?.city_id, countries]);

  if (loading|| locationLoading) return;
  if (error || rpError || cntError || stError || citiesError || cityError || stateError|| LocationError)
    return <div>Something went wrong</div>;

  const accountStatusOptions = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
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
        <Card className="p-6">
          <form onSubmit={handleSubmit}>
            <fieldset disabled={viewOnly ?? false} className="border-none">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
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
                    isMulti
                    title="Working Branch"
                    value={locationOptions?.find((item) => item.value === values.branch)}
                    options={locationOptions}
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
                    placeholder="Select Country"
                    options={countriesOptions}
                    value={countriesOptions?.find((item) => item.value === values.country)}
                    onValueChange={async (value) => {
                      setFieldTouched('country', true);
                      setFieldValue('country', value.value);
                      setFieldValue('state', '');
                      setFieldValue('city', '');
                      await fetchCountryStates({}, `${value.value}/${ENDPOINTS.STATES}`);
                    }}
                  />
                  {touched.country && errors?.country && <ErrorMsg error={errors.country} />}
                </Box>

                <Box>
                  <CustomDropdown
                    title="State"
                    name="state"
                    placeholder="Select State"
                    options={stateOptions}
                    value={stateOptions?.find((item) => item.value === values.state)||''}
                    onValueChange={async (value) => {
                      setFieldTouched('state', true);
                      setFieldValue('state', value.value);
                      setFieldValue('city', '');
                      await fetchStateCities({}, `${value.value}/${ENDPOINTS.CITIES}`);
                    }}
                  />
                  {touched.state && errors?.state && <ErrorMsg error={errors.state} />}
                </Box>

                <Box>
                  <CustomDropdown
                    title="City"
                    name="city"
                    placeholder="Select City"
                    options={cityOptions}
                    value={cityOptions?.find((item) => item.value === values.city)|| ''}
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
        </Card>
      )}
    </Formik>
  );
}
