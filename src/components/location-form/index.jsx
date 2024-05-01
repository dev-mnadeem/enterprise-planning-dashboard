import React from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import ErrorMsg from '../error-msg';
import { Box, Button } from '@mui/material';
import CustomDropdown from '../common/CustomDropdown';
import { InputField } from '../common/Input/InputField';
import {
  Cities,
  Countries,
  LocationTypes,
  LocationStatus,
  ADD_LOCATION_INITIALS,
  locationValidationSchema,
} from 'src/sections/locations/utils';

export default function LocationForm({ onSubmit, initials, buttonText }) {
  return (
    <Formik
      enableReinitialize
      onSubmit={onSubmit}
      validationSchema={locationValidationSchema}
      initialValues={initials ? initials : ADD_LOCATION_INITIALS}
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
        <div>
          <div class="grid gap-4 grid-cols-2 mt-10">
            <Box>
              <InputField
                name="name"
                title="Name"
                value={values.name}
                placeholder="Enter name"
                onChange={handleChange}
              />
              {touched.name && errors?.name && <ErrorMsg error={errors.name} />}
            </Box>
            <Box>
              <InputField
                title="Address"
                placeholder="Enter address"
                name="address"
                value={values.address}
                onChange={handleChange}
              />
              {touched.address && errors?.address && <ErrorMsg error={errors.address} />}
            </Box>
            <Box>
              <CustomDropdown
                name="locationType"
                title="Location Type"
                options={LocationTypes}
                value={LocationTypes.find((item) => item.value === values.locationType)}
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
                placeholder="Selet Country"
                options={Countries}
                value={Countries.find((item) => item.value === values.country)}
                onValueChange={(value) => {
                  setFieldTouched('country', true);
                  setFieldValue('country', value.value);
                }}
              />
              {touched.country && errors?.country && <ErrorMsg error={errors.country} />}
            </Box>
            <Box>
              <CustomDropdown
                title="City"
                name="city"
                placeholder="Selet City"
                options={Cities}
                value={Cities.find((item) => item.value === values.city)}
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
              background: '#039DFA',
              justifyContent: 'flex-end',
            }}
          >
            {buttonText}
          </Button>
        </div>
      )}
    </Formik>
  );
}

LocationForm.propTypes = {
  onSubmit: PropTypes.func,
  initials: PropTypes.object,
};
