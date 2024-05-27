import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import ErrorMsg from '../error-msg';
import { Box, Button, Card } from '@mui/material';
import { CustomDropdown, InputField } from '../common';
import {
  LocationStatus,
  ADD_LOCATION_INITIALS,
  locationValidationSchema,
} from 'src/sections/locations/utils';
import { useLazyQuery, useQuery } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';

export default function LocationForm({ onSubmit, initials, buttonText }) {
  const [fetchCity] = useLazyQuery(ENDPOINTS.CITIES);
  const [fetchState] = useLazyQuery(ENDPOINTS.STATES);
  const [initialValues, setInitialValues] = useState({ ...initials });
  const [fetchStateCities, { data: cities }] = useLazyQuery(ENDPOINTS.STATES);
  const { data: locationTypes, loading } = useQuery(ENDPOINTS.LOCATION_TYPES);
  const { data: countries, loading: cntLoading } = useQuery(ENDPOINTS.COUNTRIES);
  const [fetchCountryStates, { data: states }] = useLazyQuery(ENDPOINTS.COUNTRIES);

  const locationTypesOptions = locationTypes?.map((location) => ({
    value: location.id,
    label: location.name,
  }));
  const countriesOptions = countries?.map((country) => ({
    value: country.id,
    label: country.name,
  }));
  const stateOptions = states?.map((state) => ({ value: state.id, label: state.name }));
  const cityOptions = cities?.map((city) => ({ value: city.id, label: city.name }));

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
                locationType: initialValues.location_type_id,
                status: initialValues.status ? 'active' : 'banned',
                geoLocation: initialValues.geo_location,
              });
            });
          });
        });
      });
    }
  }, [initialValues?.city_id, countries]);

  if (loading || cntLoading) return;
  return (
    <Formik
      enableReinitialize
      onSubmit={onSubmit}
      validationSchema={locationValidationSchema}
      initialValues={initials ? initialValues : ADD_LOCATION_INITIALS}
    >
      {({ errors, touched, handleSubmit, setFieldValue, setFieldTouched, values }) => (
        <Card className="p-6">
          <fieldset className="border-none">
            <div className="grid gap-4 grid-cols-2">
              <Box>
                <InputField name="name" title="Name" placeholder="Enter name" />
                {touched.name && errors?.name && <ErrorMsg error={errors.name} />}
              </Box>
              <Box>
                <InputField
                  isAutoComplete
                  title="Address"
                  placeholder="Enter address"
                  name="address"
                  setFinalValue={(address, geo_location) => {
                    setFieldValue('address', address);
                    setFieldValue('geoLocation', geo_location);
                  }}
                />
                {touched.address && errors?.address && <ErrorMsg error={errors.address} />}
              </Box>
              <Box>
                <CustomDropdown
                  name="locationType"
                  title="Location Type"
                  options={locationTypesOptions}
                  value={locationTypesOptions?.find((item) => item.value === values.locationType)}
                  placeholder="Selet location type"
                  onValueChange={(value) => {
                    setFieldTouched('locationType', true);
                    setFieldValue('locationType', value.value);
                  }}
                />
                {touched.locationType && errors?.locationType && (
                  <ErrorMsg error={errors.locationType} />
                )}
              </Box>
              <Box>
                <CustomDropdown
                  name="status"
                  title="Location Status"
                  options={LocationStatus}
                  placeholder="Selet location status"
                  value={LocationStatus.find((item) => item.value === values.status)}
                  onValueChange={(value) => {
                    setFieldTouched('status', true);
                    setFieldValue('status', value.value);
                  }}
                />
                {touched.status && errors?.status && <ErrorMsg error={errors.status} />}
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
                  value={stateOptions?.find((item) => item.value === values.state) || ''}
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
                  value={cityOptions?.find((item) => item.value === values.city) || ''}
                  onValueChange={(value) => {
                    setFieldTouched('city', true);
                    setFieldValue('city', value.value);
                  }}
                />
                {touched.city && errors?.city && <ErrorMsg error={errors.city} />}
              </Box>
            </div>
            <Button
              onClick={handleSubmit}
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
          </fieldset>
        </Card>
      )}
    </Formik>
  );
}

LocationForm.propTypes = {
  onSubmit: PropTypes.func,
  initials: PropTypes.object,
};
