import { useEffect, useState } from 'react';
import { FieldArray, Formik } from 'formik';
import ErrorMsg from '../error-msg';
import {
  Box,
  Button,
  Card,
  Divider,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { CustomDropdown, InputField } from '../common';
import { NUMBER_FORMATS, SHIPMENT_ROUTE, SHIPMENT_TYPE, createOrderSchema } from 'src/constants';
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
import { calculateRemainingWeightLimit, sumSafely } from 'src/utils';

export default function OrderForm({ onSubmit, initials, viewOnly, buttonText }) {
  const { user } = useAppSelector((state) => state.userReducer);
  const [initialValues, setInitialValues] = useState({ ...initials });
  const { AIR, SEA, ROAD } = SHIPMENT_ROUTE;
  const { DOMESTIC, INTERNATIONAL } = SHIPMENT_TYPE;

  const [searchUser] = useLazyQuery(ENDPOINTS.USERS);
  const { data: countries, cntLoading, cntError } = useQuery(ENDPOINTS.COUNTRIES);
  const [senderCountryStates, { data: senderStates }] = useLazyQuery(ENDPOINTS.COUNTRIES);
  const [receiverCountryStates, { data: receiverStates }] = useLazyQuery(ENDPOINTS.COUNTRIES);
  const [senderStateCities, { data: senderCities }] = useLazyQuery(ENDPOINTS.STATES);
  const [receiverStateCities, { data: receiverCities }] = useLazyQuery(ENDPOINTS.STATES);
  const [getRoutePackagings, { data: packagings }] = useLazyQuery(ENDPOINTS.PACKAGINGS);
  const [getShipmentPricing, { data: shipmentPricing }] = useLazyQuery(ENDPOINTS.PRICING);

  const [getRolePermissions, { data: role, loading: rpLoading, error: rpError }] = useLazyQuery(
    ENDPOINTS.USER_ROLES
  );
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
  const shipmentRouteOptions = (type = '') =>
    useMemoized(
      [type === DOMESTIC ? [ROAD] : [SEA, AIR]]
        .flat()
        .map((type) => ({ value: type, label: type })),
      [type]
    );

  const packageValue = (id = '') =>
    useMemoized(
      packagingOptions?.find((item) => item.value === id),
      [packagingOptions, id]
    );

  if (lcError || rpError || cntError) return <div>Something went wrong</div>;

  /** FIXED PAGE SCROLLING TOP ON API CALL, NEED TO OPTIMIZE IT */
  document.activeElement.scrollIntoView({ block: 'center' });

  const onSubmitForm = (values) => {
    if (!matchIsValidTel(values?.sender_phone)) {
      toast.error('Please enter valid Customer Phone Number!');
      return;
    }

    if (!matchIsValidTel(values?.receiver_phone)) {
      toast.error('Please enter valid Receiver Phone Number!');
      return;
    }

    if (values?.sender_phone == values?.receiver_phone) {
      toast.error('Customer and Receiver cannot be same!');
      return;
    }

    onSubmit({
      ...values,
      weight_type: 'kg',
      total_amount: Number(values?.total_amount || 0),
      sub_total: Number(values?.sub_total || 0),
      status: 'pending',
      pricing: {
        from_city_id: values?.sender_city_id,
        to_city_id: values?.receiver_city_id,
        price: Number(values?.sub_total || 0),
        route: values?.shipment_route,
        package_id: values?.package_id,
      },
    });
  };

  const searchUsers = async (phoneNo = '', setFieldValue, fieldKey = '') => {
    if (!fieldKey?.length) return;

    if (matchIsValidTel(phoneNo)) {
      const res = await searchUser({ phoneNumber: phoneNo });
      if (res?.results?.length) {
        const { email, name, address } = res?.results[0];
        email && setFieldValue(`${fieldKey}_email`, email);
        name && setFieldValue(`${fieldKey}_name`, name);
        address && setFieldValue(`${fieldKey}_address`, address);
      } else {
        toast.error('User not exist!');
        setFieldValue(`${fieldKey}_email`, '');
        setFieldValue(`${fieldKey}_name`, '');
        setFieldValue(`${fieldKey}_address`, '');
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
        resetForm,
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

        useEffect(() => {
          if (
            values?.sender_city_id?.length &&
            values?.receiver_city_id?.length &&
            values?.package_id?.length &&
            values?.shipment_route?.length
          ) {
            getShipmentPricing({
              fromCityId: values.sender_city_id,
              toCityId: values.receiver_city_id,
              packageId: values.package_id,
              route: values.shipment_route?.toLowerCase(),
            });
          }
        }, [
          values?.sender_city_id,
          values?.receiver_city_id,
          values?.package_id,
          values?.shipment_route,
        ]);

        useEffect(() => {
          setFieldValue('sub_total', shipmentPricing?.[0]?.price || 0);
        }, [shipmentPricing?.[0]?.price]);

        useEffect(() => {
          if (values?.sender_phone?.length && values?.sender_phone == values?.receiver_phone) {
            toast.error('Customer and Receiver cannot be same!');
          }
        }, [values?.sender_phone, values?.receiver_phone]);

        useEffect(() => {
          const _total = sumSafely(
            0,
            values?.sub_total,
            values?.vat,
            values?.other_taxes,
            values?.service_charges
          );
          setFieldValue('total_amount', _total.toFixed(2));
        }, [values?.sub_total, values?.vat, values?.other_taxes, values?.service_charges]);

        return (
          <Card className="p-6">
            <form onSubmit={handleSubmit}>
              <fieldset disabled={viewOnly ?? false} className="border-none">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  <Box>
                    <FormLabel>Shipment Type:</FormLabel>
                    <RadioGroup
                      row={true}
                      name="type"
                      value={values?.type || 'international'}
                      onChange={async (e) => {
                        resetForm();
                        await setFieldValue('type', e.target.value);
                      }}
                    >
                      <FormControlLabel
                        value="domestic"
                        control={<Radio required={true} />}
                        label="Domestic"
                      />
                      <FormControlLabel
                        value="international"
                        control={<Radio required={true} />}
                        label="International"
                      />
                    </RadioGroup>
                  </Box>

                  <Divider className="col-span-2" />

                  <Box>
                    <CustomDropdown
                      name="shipment_route"
                      title="Shipment Route"
                      options={shipmentRouteOptions(values?.type)}
                      value={useMemoized(
                        shipmentRouteOptions(values?.type)?.find(
                          (item) => item.value === values.shipment_route
                        ) || null,
                        [values?.type, values.shipment_route]
                      )}
                      required
                      placeholder="Select Shipment Route"
                      onValueChange={async (shipment_route) => {
                        setFieldTouched('shipment_route', true);
                        setFieldValue('shipment_route', shipment_route.value);
                        setFieldValue('package_id', '');
                        await getRoutePackagings({ route: shipment_route.value });
                      }}
                    />
                    {touched.shipment_route && errors?.shipment_route && (
                      <ErrorMsg error={errors.shipment_route} />
                    )}
                  </Box>

                  <Box>
                    <CustomDropdown
                      name="package_id "
                      title="Shipment Packaging"
                      options={packagingOptions}
                      value={useMemoized(
                        packagingOptions?.find((item) => item.value === values.package_id) || null,
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

                  <Box>
                    <CustomDropdown
                      title="Branch/Frenchise"
                      name="location_id"
                      required
                      placeholder="Select Branch"
                      options={branchesOptions}
                      value={useMemoized(
                        branchesOptions?.find((item) => item.value === values.location_id) || null,
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

                  <Divider className="col-span-2" />

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
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          searchUsers(values.sender_phone, setFieldValue, 'sender');
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                searchUsers(values.sender_phone, setFieldValue, 'sender')
                              }
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
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          searchUsers(values.receiver_phone, setFieldValue, 'receiver');
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                searchUsers(values.receiver_phone, setFieldValue, 'receiver')
                              }
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

                    {touched.receiver_phone && errors?.receiver_phone && (
                      <ErrorMsg error={errors.receiver_phone} />
                    )}
                  </Box>

                  {/* <Box>
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
                  </Box> */}

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
                        countriesOptions?.find((item) => item.value === values.sender_country) ||
                          null,
                        [countriesOptions, values.sender_country]
                      )}
                      onValueChange={async (value) => {
                        setFieldTouched('sender_country', true);
                        setFieldValue('sender_country', value.value);
                        setFieldValue('sender_state', null);
                        setFieldValue('sender_city_id', null);
                        await senderCountryStates({}, `${value.value}/${ENDPOINTS.STATES}`);
                        await senderStateCities({}, `-1/${ENDPOINTS.CITIES}`);
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
                        countriesOptions?.find((item) => item.value === values.receiver_country) ||
                          null,
                        [countriesOptions, values.receiver_country]
                      )}
                      onValueChange={async (value) => {
                        setFieldTouched('receiver_country', true);
                        setFieldValue('receiver_country', value.value);
                        setFieldValue('receiver_state', null);
                        setFieldValue('receiver_city_id', null);
                        await receiverCountryStates({}, `${value.value}/${ENDPOINTS.STATES}`);
                        await receiverStateCities({}, `-1/${ENDPOINTS.CITIES}`);
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
                          senderStateOptions?.find((item) => item.value === values.sender_state) ||
                            null,
                          [senderStateOptions, values.sender_state]
                        ) || ''
                      }
                      onValueChange={async (value) => {
                        setFieldTouched('sender_state', true);
                        setFieldValue('sender_state', value.value);
                        setFieldValue('sender_city_id', null);
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
                          ) || null,
                          [receiverStateOptions, values.receiver_state]
                        ) || ''
                      }
                      onValueChange={async (value) => {
                        setFieldTouched('receiver_state', true);
                        setFieldValue('receiver_state', value.value);
                        setFieldValue('receiver_city_id', null);
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
                          senderCityOptions?.find((item) => item.value === values.sender_city_id) ||
                            null,
                          [senderCityOptions, values.sender_city_id]
                        ) || ''
                      }
                      onValueChange={async (value) => {
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
                          ) || null,
                          [receiverCityOptions, values.receiver_city_id]
                        ) || ''
                      }
                      onValueChange={async (value) => {
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
                        courierTypeOptions?.find((item) => item.value === values.courier_type) ||
                          null,
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
                        paymentTypeOptions?.find((item) => item.value === values.payment_type) ||
                          null,
                        [paymentTypeOptions, values.payment_type]
                      )}
                      required
                      placeholder="Select Payment Type"
                      onValueChange={async (payment_type) => {
                        await setFieldTouched('payment_type', true);
                        await setFieldValue('payment_type', payment_type.value);
                        await setFieldValue('payment_date', new Date());
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
                                title={`Weight (${calculateRemainingWeightLimit(
                                  values,
                                  index,
                                  Number(
                                    packagings?.find((item) => item.id === values.package_id)
                                      ?.weight_limit || 0
                                  )
                                )}kg limit)`}
                                max={calculateRemainingWeightLimit(
                                  values,
                                  index,
                                  Number(
                                    packagings?.find((item) => item.id === values.package_id)
                                      ?.weight_limit || 0
                                  )
                                )}
                                min={0}
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
                      name="sub_total"
                      title="Shipment Route Price"
                      required
                      min={0.01}
                      unit={NUMBER_FORMATS.DOLLAR}
                      value={Number(values?.sub_total || 0)}
                      disabled={!!shipmentPricing?.[0]?.price}
                      onChange={(v) => {
                        if (!!shipmentPricing?.[0]?.price) return;
                        setFieldTouched(`sub_total`, true);
                        setFieldValue(`sub_total`, v);
                      }}
                    />
                    {touched.sub_total && errors?.sub_total && (
                      <ErrorMsg error={errors.sub_total} />
                    )}
                    {!!!shipmentPricing?.[0]?.price && (
                      <Typography className="text-xs italic">
                        Price list not found for that shipment route. You can add price.
                      </Typography>
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

                  <Box>
                    <NumberField
                      name="vat"
                      title="VAT"
                      unit={NUMBER_FORMATS.DOLLAR}
                      value={Number(values?.vat || 0)}
                      onChange={(v) => {
                        setFieldTouched(`vat`, true);
                        setFieldValue(`vat`, v);
                      }}
                    />
                  </Box>

                  <Box>
                    <NumberField
                      name="service_charges"
                      title="Service Charges"
                      unit={NUMBER_FORMATS.DOLLAR}
                      value={Number(values?.service_charges || 0)}
                      onChange={(v) => {
                        setFieldTouched(`service_charges`, true);
                        setFieldValue(`service_charges`, v);
                      }}
                    />
                  </Box>

                  <Box>
                    <NumberField
                      name="other_taxes"
                      title="Other Taxes"
                      unit={NUMBER_FORMATS.DOLLAR}
                      value={Number(values?.other_taxes || 0)}
                      onChange={(v) => {
                        setFieldTouched(`other_taxes`, true);
                        setFieldValue(`other_taxes`, v);
                      }}
                    />
                  </Box>
                </div>

                <Divider className="my-4" />

                <Box className="flex flex-col items-end">
                  <Typography>
                    VAT: <span className="font-light">${values?.vat || 0}</span>
                  </Typography>
                  <Typography>
                    Other Taxes: <span className="font-light">${values?.other_taxes || 0}</span>
                  </Typography>
                  <Typography>
                    Shipment Price: <span className="font-light">${values?.sub_total || 0}</span>
                  </Typography>
                  <Typography>
                    Service Charges:{' '}
                    <span className="font-light">${values?.service_charges || 0}</span>
                  </Typography>
                  <Divider className="my-4" />
                  <Typography className="border border-solid p-2.5">
                    Amount to be Collected:{' '}
                    <span className="font-bold">${values?.total_amount || 0}</span>
                  </Typography>
                </Box>

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
