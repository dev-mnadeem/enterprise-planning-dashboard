import { useEffect, useState } from 'react';
import { FieldArray, Formik } from 'formik';
import ErrorMsg from '../error-msg';
import { Box, Button, Card, Divider, IconButton, InputAdornment, Typography } from '@mui/material';
import { CustomDropdown, InputField } from '../common';
import { NUMBER_FORMATS, createOrderSchema } from 'src/constants';
import { useLazyQuery, useQuery } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';
import toast from 'react-hot-toast';
import _ from 'lodash';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { PersonSearch } from '@mui/icons-material';
import Iconify from '../iconify/iconify';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import useMemoized from 'src/hooks/useMemoized';
import { ADD_ORDER_INITIALS } from 'src/sections/orders/utils';
import { useAppSelector } from 'src/state/hooks';
import NumberField from '../common/Input/BaseNumberField';

export default function OrderForm({ onSubmit, initials, viewOnly, buttonText }) {
  const { user } = useAppSelector((state) => state.userReducer);
  const [packages, setPackages] = useState([{}]);
  const [initialValues, setInitialValues] = useState({ ...initials });

  const [searchUser] = useLazyQuery(ENDPOINTS.USERS);
  const { data: countries, cntLoading, cntError } = useQuery(ENDPOINTS.COUNTRIES);
  const [senderCountryStates, { data: senderStates }] = useLazyQuery(ENDPOINTS.COUNTRIES);
  const [receiverCountryStates, { data: receiverStates }] = useLazyQuery(ENDPOINTS.COUNTRIES);
  const [senderStateCities, { data: senderCities }] = useLazyQuery(ENDPOINTS.STATES);
  const [receiverStateCities, { data: receiverCities }] = useLazyQuery(ENDPOINTS.STATES);
  const { data: packagings } = useQuery(ENDPOINTS.PACKAGINGS);

  const [checkedPermissions, setCheckedPermissions] = useState({});
  const [selectedState, setSelectedState] = useState(null);
  const [getRolePermissions, { data: role, loading: rpLoading, error: rpError }] = useLazyQuery(
    ENDPOINTS.USER_ROLES
  );
  const [fetchCity, { data: city, error: cityError }] = useLazyQuery(ENDPOINTS.CITIES);
  const [fetchState, { data: state, error: stateError }] = useLazyQuery(ENDPOINTS.STATES);
  const { data: branches, error: lcError } = useQuery(ENDPOINTS.LOCATIONS);

  const countriesOptions = useMemoized(
    countries?.map((country) => ({ value: country.id, label: country.name })),
    [countries]
  );
  const senderStateOptions = useMemoized(
    senderStates?.map((state) => ({ value: state.id, label: state.name })),
    [senderStates]
  );
  const receiverStateOptions = useMemoized(
    receiverStates?.map((state) => ({ value: state.id, label: state.name })),
    [receiverStates]
  );
  const senderCityOptions = useMemoized(
    senderCities?.map((city) => ({ value: city.id, label: city.name })),
    [senderCities]
  );
  const receiverCityOptions = useMemoized(
    receiverCities?.map((city) => ({ value: city.id, label: city.name })),
    [receiverCities]
  );
  const branchesOptions = useMemoized(
    user?.locations?.map((location) => ({ value: location.id, label: location.name })),
    [user?.locations]
  );
  const courierTypeOptions = useMemoized(
    ['Standard', 'Express'].map((type) => ({ value: type, label: type })),
    []
  );
  const paymentTypeOptions = useMemoized(
    ['Cash', 'Credit Card'].map((type) => ({ value: type, label: type })),
    []
  );
  const packagingOptions = useMemoized(
    packagings?.map((packaging) => ({ value: packaging.id, label: packaging.name })),
    [packagings]
  );

  useEffect(() => {
    /** FETCH STATE, CITY AND COUNTRY DATA BASED ON SELECTED CITY ID */
    const _cityId = initialValues?.city_id;
    if (_cityId && countries?.length) {
      fetchCity({}, _cityId).then((_city) => {
        fetchState({}, _city?.state_id).then((_state) => {
          senderCountryStates({}, `${_state?.country_id}/${ENDPOINTS.STATES}`).then(() => {
            senderStateCities({}, `${_city?.state_id}/${ENDPOINTS.CITIES}`).then(() => {
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

  if (lcError || rpError || cntError) return <div>Something went wrong</div>;

  const onSubmitForm = (values) => {
    console.log('🚀 ~ onSubmitForm ~ values:', { ...values, weight_type: 'kg' });

    if (!matchIsValidTel(values?.sender_phone)) {
      toast.error('Please enter valid Customer Phone Number!');
      return;
    }

    if (!matchIsValidTel(values?.receiver_phone)) {
      toast.error('Please enter valid Receiver Phone Number!');
      return;
    }

    onSubmit({ ...values, weight_type: 'kg' });
  };

  const searchUsers = async (phoneNo = '', setFieldValue) => {
    if (matchIsValidTel(phoneNo)) {
      const res = await searchUser({ phoneNumber: phoneNo });
      if (res?.results?.length) {
        const { email, name, address } = res?.results[0];
        email && setFieldValue('sender_email', email);
        name && setFieldValue('sender_name', name);
        address && setFieldValue('sender_address', address);
      } else {
        toast.error('User not exist!');
        setFieldValue('sender_email', '');
        setFieldValue('sender_name', '');
        setFieldValue('sender_address', '');
      }
    } else {
      toast.error('Please enter valid phone number!');
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      onSubmit={onSubmitForm}
      validationSchema={createOrderSchema}
      initialValues={initials ? initialValues : ADD_ORDER_INITIALS}
    >
      {({
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        values,
      }) => {
        useEffect(() => {
          const totalWeight = values.orderItems?.reduce(
            (acc, item) => acc + (parseFloat(item.weight) || 0),
            0
          );

          const totalQuantity = values.orderItems?.reduce(
            (acc, item) => acc + (parseFloat(item.quantity) || 0),
            0
          );
          setFieldValue('total_weight', totalWeight);
          setFieldValue('total_quantity', totalQuantity);
        }, [values.orderItems, setFieldValue]);

        return (
          <Card className="p-6">
            <form onSubmit={handleSubmit}>
              <fieldset disabled={viewOnly ?? false} className="border-none">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  {/* COMMENTED FOR LATER USE
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

                <Divider className="col-span-2" /> */}

                  <Box>
                    <CustomDropdown
                      title="Branch/Frenchise"
                      name="location_id"
                      required
                      placeholder="Select Branch"
                      options={branchesOptions}
                      value={useMemoized(
                        branchesOptions?.find((item) => item.value === values.location_id),
                        [branchesOptions, values.location_id]
                      )}
                      onValueChange={async (value) => {
                        setFieldTouched('location_id', true);
                        setFieldValue('location_id', value.value);
                      }}
                    />
                    {touched.location_id && errors?.location_id && (
                      <ErrorMsg error={errors.location_id} />
                    )}
                  </Box>

                  <Box>
                    <Typography className="required">Shipping Date</Typography>
                    <DateTimePicker
                      name="shipping_date"
                      className="w-full"
                      value={dayjs(values.shipping_date || new Date())}
                      onChange={(date) => {
                        setFieldTouched('shipping_date', true);
                        setFieldValue('shipping_date', new Date(date));
                      }}
                    />
                    {touched.shipping_date && errors?.shipping_date && (
                      <ErrorMsg error={errors.shipping_date} />
                    )}
                  </Box>

                  <Box>
                    <Typography className="required">Collection Time</Typography>
                    <DateTimePicker
                      name="collection_time"
                      className="w-full"
                      value={dayjs(values.shipping_date || new Date())}
                      onChange={(date) => {
                        setFieldTouched('collection_time', true);
                        setFieldValue('collection_time', new Date(date));
                      }}
                    />
                    {touched.collection_time && errors?.collection_time && (
                      <ErrorMsg error={errors.collection_time} />
                    )}
                  </Box>

                  <Box>
                    <Typography className="required">Customer Phone</Typography>
                    <MuiTelInput
                      name="sender_phone"
                      fullWidth
                      value={values.sender_phone}
                      defaultCountry="US"
                      forceCallingCode
                      disableFormatting
                      focusOnSelectCountry
                      onlyCountries={countries?.map((country) => country.code)}
                      onChange={(value) => {
                        setFieldTouched('sender_phone', true);
                        setFieldValue('sender_phone', value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => searchUsers(values.sender_phone, setFieldValue)}
                              edge="end"
                              style={{ backgroundColor: '#f0f0f0' }}
                            >
                              <PersonSearch />
                            </IconButton>
                          </InputAdornment>
                        ),
                        style: { textAlign: 'center' },
                      }}
                    />

                    {touched.sender_phone && errors?.sender_phone && (
                      <ErrorMsg error={errors.sender_phone} />
                    )}
                  </Box>

                  <Box>
                    <InputField
                      title="Customer Email"
                      placeholder="jhon@example.com"
                      name="sender_email"
                      value={values.sender_email}
                      onChange={handleChange}
                    />
                    {touched.sender_email && errors?.sender_email && (
                      <ErrorMsg error={errors.sender_email} />
                    )}
                  </Box>

                  <Box>
                    <InputField
                      title="Customer Name"
                      name="sender_name"
                      required
                      value={values.sender_name}
                      placeholder="Jhon Doe"
                      onChange={handleChange}
                    />

                    {touched.sender_name && errors?.sender_name && (
                      <ErrorMsg error={errors.sender_name} />
                    )}
                  </Box>

                  <Box>
                    <InputField
                      title="Customer Address"
                      placeholder="H # 123, Street # 123"
                      name="sender_address"
                      required
                      value={values.sender_address}
                      onChange={handleChange}
                    />
                    {touched.sender_address && errors?.sender_address && (
                      <ErrorMsg error={errors.sender_address} />
                    )}
                  </Box>

                  <Box>
                    <InputField
                      title="Receiver Name"
                      placeholder="Jhon Doe"
                      name="receiver_name"
                      required
                      value={values.receiver_name}
                      onChange={handleChange}
                    />
                    {touched.receiver_name && errors?.receiver_name && (
                      <ErrorMsg error={errors.receiver_name} />
                    )}
                  </Box>

                  <Box>
                    <Typography className="required">Receiver Phone</Typography>
                    <MuiTelInput
                      name="receiver_phone"
                      fullWidth
                      value={values.receiver_phone}
                      defaultCountry="US"
                      forceCallingCode
                      disableFormatting
                      focusOnSelectCountry
                      onlyCountries={countries?.map((country) => country.code)}
                      onChange={(value) => {
                        setFieldTouched('receiver_phone', true);
                        setFieldValue('receiver_phone', value);
                      }}
                    />

                    {touched.receiver_phone && errors?.receiver_phone && (
                      <ErrorMsg error={errors.receiver_phone} />
                    )}
                  </Box>

                  <Box>
                    <InputField
                      title="Receiver Email"
                      placeholder="mike@gmail.com"
                      name="receiver_email"
                      value={values.receiver_email}
                      onChange={handleChange}
                    />
                    {touched.receiver_email && errors?.receiver_email && (
                      <ErrorMsg error={errors.receiver_email} />
                    )}
                  </Box>

                  <Box className="col-span-2">
                    <InputField
                      title="Receiver Address"
                      placeholder="H # 123, Street # 123"
                      name="receiver_address"
                      required
                      value={values.receiver_address}
                      onChange={handleChange}
                    />
                    {touched.receiver_address && errors?.receiver_address && (
                      <ErrorMsg error={errors.receiver_address} />
                    )}
                  </Box>

                  <Box>
                    <CustomDropdown
                      title="From Country"
                      name="sender_country"
                      required
                      placeholder="Select Country"
                      options={countriesOptions}
                      value={useMemoized(
                        countriesOptions?.find((item) => item.value === values.sender_country),
                        [countriesOptions, values.sender_country]
                      )}
                      onValueChange={async (value) => {
                        setFieldTouched('sender_country', true);
                        setFieldValue('sender_country', value.value);
                        setFieldValue('state', null);
                        setFieldValue('city', null);
                        await senderCountryStates({}, `${value.value}/${ENDPOINTS.STATES}`);
                      }}
                    />
                    {touched.sender_country && errors?.sender_country && (
                      <ErrorMsg error={errors.sender_country} />
                    )}
                  </Box>

                  <Box>
                    <CustomDropdown
                      title="To Country"
                      name="receiver_country"
                      required
                      placeholder="Select Country"
                      options={countriesOptions}
                      value={useMemoized(
                        countriesOptions?.find((item) => item.value === values.receiver_country),
                        [countriesOptions, values.receiver_country]
                      )}
                      onValueChange={async (value) => {
                        setFieldTouched('receiver_country', true);
                        setFieldValue('receiver_country', value.value);
                        setFieldValue('toState', null);
                        setFieldValue('toCity', null);
                        await receiverCountryStates({}, `${value.value}/${ENDPOINTS.STATES}`);
                      }}
                    />
                    {touched.receiver_country && errors?.receiver_country && (
                      <ErrorMsg error={errors.receiver_country} />
                    )}
                  </Box>

                  <Box>
                    <CustomDropdown
                      title="From State"
                      name="sender_state"
                      required
                      placeholder="Select State"
                      options={senderStateOptions}
                      value={
                        useMemoized(
                          senderStateOptions?.find((item) => item.value === values.sender_state),
                          [senderStateOptions, values.sender_state]
                        ) || ''
                      }
                      onValueChange={async (value) => {
                        setFieldTouched('sender_state', true);
                        setFieldValue('sender_state', value.value);
                        await senderStateCities({}, `${value.value}/${ENDPOINTS.CITIES}`);
                      }}
                    />
                    {touched.sender_state && errors?.sender_state && (
                      <ErrorMsg error={errors.sender_state} />
                    )}
                  </Box>

                  <Box>
                    <CustomDropdown
                      title="To State"
                      name="receiver_state"
                      required
                      placeholder="Select State"
                      options={receiverStateOptions}
                      value={
                        useMemoized(
                          receiverStateOptions?.find(
                            (item) => item.value === values.receiver_state
                          ),
                          [receiverStateOptions, values.receiver_state]
                        ) || ''
                      }
                      onValueChange={async (value) => {
                        setFieldTouched('receiver_state', true);
                        setFieldValue('receiver_state', value.value);
                        await receiverStateCities({}, `${value.value}/${ENDPOINTS.CITIES}`);
                      }}
                    />
                    {touched.receiver_state && errors?.receiver_state && (
                      <ErrorMsg error={errors.receiver_state} />
                    )}
                  </Box>

                  <Box>
                    <CustomDropdown
                      title="From City"
                      name="sender_city_id"
                      required
                      placeholder="Select City"
                      options={senderCityOptions}
                      value={
                        useMemoized(
                          senderCityOptions?.find((item) => item.value === values.sender_city_id),
                          [senderCityOptions, values.sender_city_id]
                        ) || ''
                      }
                      onValueChange={(value) => {
                        setFieldTouched('sender_city_id', true);
                        setFieldValue('sender_city_id', value.value);
                      }}
                    />
                    {touched.sender_city_id && errors?.sender_city_id && (
                      <ErrorMsg error={errors.sender_city_id} />
                    )}
                  </Box>

                  <Box>
                    <CustomDropdown
                      title="To City"
                      required
                      name="receiver_city_id"
                      placeholder="Select City"
                      options={receiverCityOptions}
                      value={
                        useMemoized(
                          receiverCityOptions?.find(
                            (item) => item.value === values.receiver_city_id
                          ),
                          [receiverCityOptions, values.receiver_city_id]
                        ) || ''
                      }
                      onValueChange={(value) => {
                        setFieldTouched('receiver_city_id', true);
                        setFieldValue('receiver_city_id', value.value);
                      }}
                    />
                    {touched.receiver_city_id && errors?.receiver_city_id && (
                      <ErrorMsg error={errors.receiver_city_id} />
                    )}
                  </Box>

                  <Box>
                    <CustomDropdown
                      name="courier_type "
                      title="Courier Type"
                      options={courierTypeOptions}
                      value={useMemoized(
                        courierTypeOptions?.find((item) => item.value === values.courier_type),
                        [courierTypeOptions, values.courier_type]
                      )}
                      required
                      placeholder="Select Courier Type"
                      onValueChange={(courier_type) => {
                        setFieldTouched('courier_type', true);
                        setFieldValue('courier_type', courier_type.value);
                      }}
                    />
                    {touched.courier_type && errors?.courier_type && (
                      <ErrorMsg error={errors.courier_type} />
                    )}
                  </Box>

                  <Box>
                    <CustomDropdown
                      name="payment_type "
                      title="Payment Type"
                      options={paymentTypeOptions}
                      value={useMemoized(
                        paymentTypeOptions?.find((item) => item.value === values.payment_type),
                        [paymentTypeOptions, values.payment_type]
                      )}
                      required
                      placeholder="Select Payment Type"
                      onValueChange={(payment_type) => {
                        setFieldTouched('payment_type', true);
                        setFieldValue('payment_type', payment_type.value);
                        setFieldValue('payment_date', new Date());
                      }}
                    />
                    {touched.payment_type && errors?.payment_type && (
                      <ErrorMsg error={errors.payment_type} />
                    )}
                  </Box>

                  {/* COMMENTED FOR LATER USE
                <Box className="col-span-2">
                  <InputField
                    title="Attachments"
                    name="attachments"
                    type="file"
                    value={''}
                    onChange={handleChange}
                  />
                  {touched.attachments && errors?.attachments && <ErrorMsg error={errors.attachments} />}
                </Box> */}

                  <Divider className="col-span-2" />

                  <Typography variant="h4" className="col-span-2">
                    Package Info:
                  </Typography>

                  <Box>
                    <CustomDropdown
                      name="package_id "
                      title="Shipment Packaging"
                      options={packagingOptions}
                      value={useMemoized(
                        packagingOptions?.find((item) => item.value === values.package_id),
                        [packagingOptions, values.package_id]
                      )}
                      required
                      placeholder="Select Shipment Packaging"
                      onValueChange={(package_id) => {
                        setFieldTouched('package_id', true);
                        setFieldValue('package_id', package_id.value);
                      }}
                    />
                    {touched.package_id && errors?.package_id && (
                      <ErrorMsg error={errors.package_id} />
                    )}
                  </Box>

                  <FieldArray name="orderItems">
                    {({ push, remove }) => (
                      <>
                        {values.orderItems?.map((pkg, index) => (
                          <Box
                            key={index}
                            className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 mt-4 col-span-2"
                          >
                            <Box className="col-span-1">
                              <InputField
                                title="Item Name"
                                placeholder=""
                                name={`orderItems[${index}].name`}
                              />
                              {touched?.orderItems?.[index]?.name &&
                                errors?.orderItems?.[index]?.name && (
                                  <ErrorMsg error={errors.orderItems[index].name} />
                                )}
                            </Box>

                            <Box className="col-span-1">
                              <InputField
                                title="Description"
                                placeholder=""
                                name={`orderItems[${index}].description`}
                              />
                              {touched?.orderItems?.[index]?.description &&
                                errors?.orderItems?.[index]?.description && (
                                  <ErrorMsg error={errors.orderItems[index].description} />
                                )}
                            </Box>

                            <Box>
                              <NumberField
                                name={`orderItems[${index}].weight`}
                                title="Weight"
                                unit={NUMBER_FORMATS.KG}
                                value={Number(values?.orderItems?.[index]?.weight || 0)}
                                required
                                onChange={(v) => {
                                  setFieldTouched(`orderItems[${index}].weight`, true);
                                  setFieldValue(`orderItems[${index}].weight`, v);
                                  setFieldValue('weight_type', 'kg');
                                }}
                              />
                              {touched?.orderItems?.[index]?.weight &&
                                errors?.orderItems?.[index]?.weight && (
                                  <ErrorMsg error={errors.orderItems[index].weight} />
                                )}
                            </Box>

                            <Box>
                              <NumberField
                                name={`orderItems[${index}].quantity`}
                                title="Quantity"
                                step={1}
                                required
                                value={Number(values?.orderItems?.[index]?.quantity || 0)}
                                onChange={(v) => {
                                  setFieldTouched(`orderItems[${index}].quantity`, true);
                                  setFieldValue(`orderItems[${index}].quantity`, v);
                                }}
                              />
                              {touched?.orderItems?.[index]?.quantity &&
                                errors?.orderItems?.[index]?.quantity && (
                                  <ErrorMsg error={errors.orderItems[index].quantity} />
                                )}
                            </Box>

                            {values.orderItems.length > 1 && (
                              <Button
                                variant="outlined"
                                color="secondary"
                                className="w-max mt-2"
                                onClick={() => remove(index)}
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
                          onClick={() =>
                            push({ name: '', description: '', weight: '', quantity: '' })
                          }
                        >
                          Add Package
                        </Button>
                      </>
                    )}
                  </FieldArray>

                  <Divider className="col-span-2" />

                  <Box>
                    <NumberField
                      name="total_amount"
                      title="Amount to be Collected"
                      unit={NUMBER_FORMATS.DOLLAR}
                      value={values.total_amount}
                      disabled
                    />
                    {touched.total_amount && errors?.total_amount && (
                      <ErrorMsg error={errors.total_amount} />
                    )}
                  </Box>

                  <Box>
                    <NumberField
                      name="total_weight"
                      title="Total Weight"
                      unit={NUMBER_FORMATS.KG}
                      value={values.total_weight}
                      disabled
                    />
                    {touched.total_weight && errors?.total_weight && (
                      <ErrorMsg error={errors.total_weight} />
                    )}
                  </Box>
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
        );
      }}
    </Formik>
  );
}
