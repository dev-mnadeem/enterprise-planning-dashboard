import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import ErrorMsg from '../error-msg';
import { Box, Button, Card, Divider } from '@mui/material';
import { CustomDropdown } from '../common';
import { SHIPMENT_ROUTE, createPricingSchema } from 'src/constants';
import _ from 'lodash';
import NumberField from '../common/Input/NumberField';
import Iconify from '../iconify/iconify';
import { ADD_PRICING_INITIALS } from 'src/sections/pricing/utils';
import useMemoized from 'src/hooks/useMemoized';
import { useLazyQuery, useQuery } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';
import toast from 'react-hot-toast';

export default function PricingForm({ onSubmit, initials, viewOnly, buttonText }) {
  const [initialValues, setInitialValues] = useState({ ...initials });
  const { AIR, SEA, ROAD } = SHIPMENT_ROUTE;

  const { data: countries, cntLoading, cntError } = useQuery(ENDPOINTS.COUNTRIES);
  const [senderCountryStates, { data: senderStates }] = useLazyQuery(ENDPOINTS.COUNTRIES);
  const [receiverCountryStates, { data: receiverStates }] = useLazyQuery(ENDPOINTS.COUNTRIES);
  const [senderStateCities, { data: senderCities }] = useLazyQuery(ENDPOINTS.STATES);
  const [receiverStateCities, { data: receiverCities }] = useLazyQuery(ENDPOINTS.STATES);
  const [getRoutePackagings, { data: packagings }] = useLazyQuery(ENDPOINTS.PACKAGINGS);

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

  const shipmentRouteOptions = useMemoized(
    [AIR, SEA, ROAD].map((type) => ({ value: type, label: type })),
    []
  );

  const priceVariationOptions = useMemoized(
    [
      { value: true, label: 'Fixed' },
      { value: false, label: 'Per Kg/Volume' },
    ].map((type) => ({ value: type.value, label: type.label })),
    []
  );

  const packagingOptions = useMemoized(
    packagings?.map((packaging) => ({ value: packaging.id, label: packaging.name })),
    [packagings]
  );

  const onSubmitForm = (values) => {
    onSubmit({ ...values });
  };

  return (
    <Formik
      enableReinitialize={true}
      onSubmit={onSubmitForm}
      validationSchema={createPricingSchema}
      initialValues={initials ? initialValues : ADD_PRICING_INITIALS}
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
          /** PREFILL COUNTRY, STATE, CITY In EDIT CASE */
          const prefillLocationData = async () => {
            try {
              if (initialValues?.from_city_id) {
                const _fromLocation = initialValues?.from_city;
                const {
                  id: _fromCityId,
                  state: { id: _fromStateId, country_id: _fromCountryId },
                } = _fromLocation;

                await setFieldValue('sender_country', _fromCountryId);
                await senderCountryStates({}, `${_fromCountryId}/${ENDPOINTS.STATES}`);
                await setFieldValue('sender_state', _fromStateId);

                await senderStateCities({}, `${_fromStateId}/${ENDPOINTS.CITIES}`);
                await setFieldValue('from_city_id', _fromCityId);
              }
              if (initialValues?.to_city_id) {
                const _toLocation = initialValues?.to_city;
                const {
                  id: _toCityId,
                  state: { id: _toStateId, country_id: _toCountryId },
                } = _toLocation;

                await setFieldValue('receiver_country', _toCountryId);
                await receiverCountryStates({}, `${_toCountryId}/${ENDPOINTS.STATES}`);
                await setFieldValue('receiver_state', _toStateId);

                await receiverStateCities({}, `${_toStateId}/${ENDPOINTS.CITIES}`);
                await setFieldValue('to_city_id', _toCityId);
              }
            } catch (error) {
              toast.error('Issue occurred while prefilling data.');
            }
          };

          prefillLocationData();
        }, [initialValues?.from_city_id]);

        useEffect(() => {
          if (initialValues?.route) {
            setFieldValue('shipment_route', initialValues?.route);
            getRoutePackagings({
              route: initialValues?.route === SEA ? 'sea' : 'air',
            }).then(() => {
              setFieldValue('package_id', initialValues?.package_id);
            });
          }
        }, [initialValues?.route]);

        return (
          <Card className="p-6">
            <form onSubmit={handleSubmit}>
              <fieldset disabled={viewOnly ?? false} className="border-none">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  <Box>
                    <CustomDropdown
                      name="shipment_route"
                      title="Shipment Route"
                      options={shipmentRouteOptions}
                      value={useMemoized(
                        shipmentRouteOptions?.find((item) => item.value === values.shipment_route),
                        [shipmentRouteOptions, values.shipment_route]
                      )}
                      required
                      placeholder="Select Shipment By"
                      onValueChange={async (shipment_route) => {
                        setFieldTouched('shipment_route', true);
                        setFieldValue('shipment_route', shipment_route.value);
                        setFieldValue('weight_type', shipment_route.value === SEA ? 'cbm' : 'kg');
                        await getRoutePackagings({
                          route: shipment_route.value === SEA ? 'sea' : 'air',
                        });
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
                      name="from_city_id"
                      required
                      placeholder="Select City"
                      options={senderCityOptions}
                      value={
                        useMemoized(
                          senderCityOptions?.find((item) => item.value === values.from_city_id),
                          [senderCityOptions, values.from_city_id]
                        ) || ''
                      }
                      onValueChange={(value) => {
                        setFieldTouched('from_city_id', true);
                        setFieldValue('from_city_id', value.value);
                      }}
                    />
                    {touched.from_city_id && errors?.from_city_id && (
                      <ErrorMsg error={errors.from_city_id} />
                    )}
                  </Box>

                  <Box>
                    <CustomDropdown
                      title="To City"
                      required
                      name="to_city_id"
                      placeholder="Select City"
                      options={receiverCityOptions}
                      value={
                        useMemoized(
                          receiverCityOptions?.find((item) => item.value === values.to_city_id),
                          [receiverCityOptions, values.to_city_id]
                        ) || ''
                      }
                      onValueChange={(value) => {
                        setFieldTouched('to_city_id', true);
                        setFieldValue('to_city_id', value.value);
                      }}
                    />
                    {touched.to_city_id && errors?.to_city_id && (
                      <ErrorMsg error={errors.to_city_id} />
                    )}
                  </Box>

                  <Box>
                    <NumberField
                      name="price"
                      title="Shiping Rate"
                      required
                      unit={`$`}
                      value={values.price}
                      onChange={handleChange}
                    />
                    {touched.price && errors?.price && <ErrorMsg error={errors.price} />}
                  </Box>

                  <Box>
                    <CustomDropdown
                      name="is_fixed"
                      title="Price Type"
                      options={priceVariationOptions}
                      value={useMemoized(
                        priceVariationOptions?.find((item) => item.value === values.is_fixed),
                        [priceVariationOptions, values.is_fixed]
                      )}
                      required
                      placeholder="Select is price fixed"
                      onValueChange={async (is_fixed) => {
                        setFieldTouched('is_fixed', true);
                        setFieldValue('is_fixed', is_fixed.value);
                      }}
                    />
                    {touched.is_fixed && errors?.is_fixed && <ErrorMsg error={errors.is_fixed} />}
                  </Box>
                </div>

                <Divider className="my-4" />

                {viewOnly ? null : (
                  <Button
                    type="submit"
                    variant="contained"
                    className="col-span-2 mt-6"
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
