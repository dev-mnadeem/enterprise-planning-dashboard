import { forwardRef, useEffect, useState } from 'react';
import { Formik } from 'formik';
import ErrorMsg from '../error-msg';
import {
  Box,
  Button,
  Card,
  Divider,
  FormControlLabel,
  FormLabel,
  IconButton,
  Input,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { CustomDropdown, InputField } from '../common';
import { userFormValidationSchema } from 'src/constants';
import { ADD_SHIPMENT_INITIALS, ADD_USER_INITIALS } from 'src/sections/user/utils';
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
import { MuiTelInput } from 'mui-tel-input';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import NumberField from '../common/Input/NumberField';
import Iconify from '../iconify/iconify';

export default function ShipmentForm({ onSubmit, initials = {}, viewOnly, buttonText }) {
  const [packages, setPackages] = useState([{}]);

  const [initialValues, setInitialValues] = useState({ ...initials });
  const [checkedPermissions, setCheckedPermissions] = useState({});
  const [selectedState, setSelectedState] = useState(null);
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
    /** FETCH STATE, CITY AND COUNTRY DATA BASED ON SELECTED CITY ID */
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

  if (loading) return;
  if (error || rpError || cntError || stError || citiesError)
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

  const addPackage = () => {
    setPackages([...packages, {}]);
  };

  const removePackage = (index) => {
    setPackages(packages.filter((_, pkgIndex) => pkgIndex !== index));
  };

  return (
    <Formik
      // enableReinitialize={true}
      // onSubmit={onSubmitForm}
      // validationSchema={userFormValidationSchema}
      initialValues={initials ? initialValues : ADD_SHIPMENT_INITIALS}
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
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                <Box className="col-span-2">
                  <FormLabel>Shipment Type:</FormLabel>
                  <RadioGroup row={true} name="position">
                    <FormControlLabel
                      value="pick"
                      control={<Radio />}
                      label="Pickup (For door to door delivery)"
                    />
                    <FormControlLabel
                      value="drop"
                      control={<Radio />}
                      label="Drop off (For delivery package from branch directly)"
                    />
                  </RadioGroup>
                </Box>

                <Divider className="col-span-2" />

                <Box>
                  <InputField
                    name="branch"
                    title="Branch"
                    // value={values.branch}
                    required
                    placeholder="Choose Branch"
                    onChange={handleChange}
                  />
                  {/* {touched.branch && errors?.branch && <ErrorMsg error={errors.branch} />} */}
                </Box>

                <Box>
                  <InputField
                    title="Shipping Date"
                    placeholder={new Date().toDateString()}
                    name="shippingDate"
                    value={new Date()}
                    onChange={handleChange}
                  />
                  {/* {touched.email && errors?.email && <ErrorMsg error={errors.email} />} */}
                </Box>

                <Box>
                  <InputField
                    title="Collection Time"
                    placeholder={new Date().toDateString()}
                    name="collectionTime"
                    value={new Date()}
                    onChange={handleChange}
                  />
                  {/* {touched.phone_number && errors?.phone_number && (
                    <ErrorMsg error={errors.phone_number} />
                  )} */}
                </Box>

                <Box>
                  <InputField
                    title="Customer/Sender"
                    placeholder="Jhon Doe"
                    name="sender"
                    required
                    value={''}
                    onChange={handleChange}
                  />
                  {/* {touched.address && errors?.address && <ErrorMsg error={errors.address} />} */}
                </Box>

                <Box>
                  <Typography className="required">Customer Phone</Typography>
                  <MuiTelInput
                    name="phone_number"
                    fullWidth
                    value={values.phone_number}
                    defaultCountry="US"
                    forceCallingCode
                    focusOnSelectCountry
                    onlyCountries={countries?.map((country) => country.code)}
                    onChange={(value) => {
                      setFieldTouched('phone_number', true);
                      setFieldValue('phone_number', value);
                    }}
                  />

                  {/* {touched.address && errors?.address && <ErrorMsg error={errors.address} />} */}
                </Box>

                <Box>
                  <InputField
                    title="Customer Address"
                    placeholder="H # 123, Street # 123"
                    name="customerAddress"
                    required
                    value={''}
                    onChange={handleChange}
                  />
                  {/* {touched.address && errors?.address && <ErrorMsg error={errors.address} />} */}
                </Box>

                <Box>
                  <InputField
                    title="Receiver Name"
                    placeholder="Jhon Doe"
                    name="receiverName"
                    required
                    value={''}
                    onChange={handleChange}
                  />
                  {/* {touched.address && errors?.address && <ErrorMsg error={errors.address} />} */}
                </Box>

                <Box>
                  <Typography className="required">Receiver Phone</Typography>
                  <MuiTelInput
                    name="receiverPhoneNo"
                    fullWidth
                    value={values.receiverPhoneNo}
                    defaultCountry="US"
                    forceCallingCode
                    focusOnSelectCountry
                    onlyCountries={countries?.map((country) => country.code)}
                    onChange={(value) => {
                      setFieldTouched('receiverPhoneNo', true);
                      setFieldValue('receiverPhoneNo', value);
                    }}
                  />

                  {/* {touched.address && errors?.address && <ErrorMsg error={errors.address} />} */}
                </Box>

                <Box className="col-span-2">
                  <InputField
                    title="Receiver Address"
                    placeholder="H # 123, Street # 123"
                    name="receiverAddress"
                    required
                    value={''}
                    onChange={handleChange}
                  />
                  {/* {touched.address && errors?.address && <ErrorMsg error={errors.address} />} */}
                </Box>

                <Box>
                  <CustomDropdown
                    title="From Country"
                    name="fromCountry"
                    required
                    placeholder="Select Country"
                    options={countriesOptions}
                    // value={countriesOptions?.find((item) => item.value === values.country)}
                    onValueChange={async (value) => {
                      setFieldTouched('fromCountry', true);
                      setFieldValue('fromCountry', value.value);
                      setFieldValue('state', null);
                      setFieldValue('city', null);
                      await fetchCountryStates({}, `${value.value}/${ENDPOINTS.STATES}`);
                    }}
                  />
                  {/* {touched.fromCountry && errors?.fromCountry && <ErrorMsg error={errors.fromCountry} />} */}
                </Box>

                <Box>
                  <CustomDropdown
                    title="To Country"
                    name="toCountry"
                    required
                    placeholder="Select Country"
                    options={countriesOptions}
                    // value={countriesOptions?.find((item) => item.value === values.country)}
                    onValueChange={async (value) => {
                      setFieldTouched('toCountry', true);
                      setFieldValue('toCountry', value.value);
                      setFieldValue('toState', null);
                      setFieldValue('toCity', null);
                      // await fetchCountryStates({}, `${value.value}/${ENDPOINTS.STATES}`);
                    }}
                  />
                  {/* {touched.toCountry && errors?.toCountry && <ErrorMsg error={errors.toCountry} />} */}
                </Box>

                <Box>
                  <CustomDropdown
                    title="From State"
                    name="fromState"
                    required
                    placeholder="Select State"
                    options={stateOptions}
                    // value={stateOptions?.find((item) => item.value === values.state)}
                    onValueChange={async (value) => {
                      setFieldTouched('fromState', true);
                      setFieldValue('fromState', value.value);
                      await fetchStateCities({}, `${value.value}/${ENDPOINTS.CITIES}`);
                    }}
                  />
                  {/* {touched.fromState && errors?.fromState && <ErrorMsg error={errors.fromState} />} */}
                </Box>

                <Box>
                  <CustomDropdown
                    title="To State"
                    name="toState"
                    required
                    placeholder="Select State"
                    options={stateOptions}
                    // value={stateOptions?.find((item) => item.value === values.state)}
                    onValueChange={async (value) => {
                      setFieldTouched('toState', true);
                      setFieldValue('toState', value.value);
                      // await fetchStateCities({}, `${value.value}/${ENDPOINTS.CITIES}`);
                    }}
                  />
                  {/* {touched.toState && errors?.toState && <ErrorMsg error={errors.toState} />} */}
                </Box>

                <Box>
                  <CustomDropdown
                    title="From City"
                    name="fromCity"
                    required
                    placeholder="Select City"
                    options={cityOptions}
                    // value={cityOptions?.find((item) => item.value === values.city)}
                    onValueChange={(value) => {
                      setFieldTouched('fromCity', true);
                      setFieldValue('fromCity', value.value);
                    }}
                  />
                  {/* {touched.fromCity && errors?.fromCity && <ErrorMsg error={errors.fromCity} />} */}
                </Box>

                <Box>
                  <CustomDropdown
                    title="To City"
                    required
                    name="toCity"
                    placeholder="Select City"
                    options={cityOptions}
                    // value={cityOptions?.find((item) => item.value === values.city)}
                    onValueChange={(value) => {
                      setFieldTouched('toCity', true);
                      setFieldValue('toCity', value.value);
                    }}
                  />
                  {/* {touched.toCity && errors?.toCity && <ErrorMsg error={errors.toCity} />} */}
                </Box>

                <Box>
                  <CustomDropdown
                    name="paymentType "
                    title="Payment Type"
                    value={null}
                    options={[]}
                    required
                    placeholder="Select Payment Type"
                    onValueChange={(paymentType) => {
                      setFieldTouched('paymentType', true);
                      setFieldValue('paymentType', paymentType.value);
                    }}
                  />
                  {touched.paymentType && errors?.paymentType && (
                    <ErrorMsg error={errors.paymentType} />
                  )}
                </Box>

                <Box className="col-span-2">
                  <InputField
                    title="Attachments"
                    name="attachments"
                    type="file"
                    value={''}
                    onChange={handleChange}
                  />
                  {/* {touched.address && errors?.address && <ErrorMsg error={errors.address} />} */}
                </Box>

                <Divider className="col-span-2" />

                <Typography variant="h4">Package Info:</Typography>

                {packages.map((pkg, index) => (
                  <Box
                    key={index}
                    className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 mt-4 col-span-2"
                  >
                    <Box className="col-span-1">
                      <InputField
                        title="Item Name"
                        placeholder=""
                        name="itemName"
                        value={''}
                        onChange={handleChange}
                      />
                      {/* {touched.address && errors?.address && <ErrorMsg error={errors.address} />} */}
                    </Box>

                    <Box className="col-span-1">
                      <InputField
                        title="Description"
                        placeholder=""
                        name="itemDesc"
                        value={''}
                        multiline
                        onChange={handleChange}
                      />
                      {/* {touched.address && errors?.address && <ErrorMsg error={errors.address} />} */}
                    </Box>

                    <NumberField title="Weight" unit="Kg" />

                    <NumberField title="Quantity" />

                    <Typography variant="h6" className="col-span-2">
                      Dimensions [Length x Width x Height] (cm) *
                    </Typography>

                    <Box className="col-span-2 flex">
                      <NumberField unit={'cm'} />

                      <NumberField unit={'cm'} />

                      <NumberField unit={'cm'} />
                    </Box>

                    {packages.length > 1 && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        className="w-max mt-2"
                        onClick={() => removePackage(index)}
                        startIcon={<Iconify icon="eva:trash-2-outline" />}
                      >
                        Delete
                      </Button>
                    )}

                    <Divider className="col-span-2" />
                  </Box>
                ))}

                <Button
                  variant="contained"
                  color="inherit"
                  className="w-max"
                  sx={{
                    display: 'flex',
                    padding: '10px 16px',
                    marginTop: '15px',
                  }}
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  onClick={addPackage}
                >
                  Add Package
                </Button>

                <Divider className="col-span-2" />

                <NumberField title="Amount to be Collected" unit="$" />

                <NumberField title="Total Weight" unit="Kg" />
              </div>

              <Divider className="my-4" />

              {viewOnly ? null : (
                <Button
                  type="submit"
                  variant="contained"
                  className="col-span-2 mt-10"
                  color="inherit"
                  sx={{
                    padding: '12px 16px',
                    float: 'right',
                  }}
                  startIcon={<Iconify icon="eva:navigation-2-outline" />}
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
