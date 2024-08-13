import { useState } from 'react';
import { Formik } from 'formik';
import ErrorMsg from '../error-msg';
import { Box, Button, Card, Divider } from '@mui/material';
import { CustomDropdown, InputField } from '../common';
import { createVehicleSchema } from 'src/constants';
import _ from 'lodash';
import Iconify from '../iconify/iconify';
import useMemoized from 'src/hooks/useMemoized';
import { ADD_VEHICLE_INITIALS } from 'src/sections/vehicles/utils';
import { useQuery } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';

export default function VehicleForm({ onSubmit, initials, viewOnly, buttonText }) {
  const [initialValues, setInitialValues] = useState({ ...initials });
  const { data: drivers } = useQuery(`${ENDPOINTS.USERS}?role=driver`);
  const { data: vehicleTypes } = useQuery(ENDPOINTS.VEHICLE_TYPES);

  const driversOptions = useMemoized(
    drivers?.results?.map((driver) => ({ value: driver.id, label: driver.name })),
    [drivers]
  );
  const vehicleTypesOptions = useMemoized(
    vehicleTypes?.map((vehicleType) => ({ value: vehicleType.id, label: vehicleType.name })),
    [vehicleTypes]
  );
  const vehicleStatusOptions = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
  ];

  const onSubmitForm = (values) => {
    onSubmit({ ...values });
  };

  return (
    <Formik
      enableReinitialize={true}
      onSubmit={onSubmitForm}
      validationSchema={createVehicleSchema}
      initialValues={initials ? initialValues : ADD_VEHICLE_INITIALS}
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
                <Box>
                  <InputField
                    title="Vehicle Name"
                    name="name"
                    required
                    value={values.name}
                    placeholder="Toyota Pick-up"
                    onChange={handleChange}
                  />

                  {touched.name && errors?.name && <ErrorMsg error={errors.name} />}
                </Box>

                <Box>
                  <InputField
                    title="Vehicle Model"
                    name="model"
                    required
                    value={values.model}
                    placeholder="2024"
                    onChange={handleChange}
                  />

                  {touched.model && errors?.model && <ErrorMsg error={errors.model} />}
                </Box>

                <Box>
                  <InputField
                    title="Registration Number"
                    name="registration_number"
                    required
                    value={values.registration_number}
                    placeholder="AD20901"
                    onChange={handleChange}
                  />

                  {touched.registration_number && errors?.registration_number && (
                    <ErrorMsg error={errors.registration_number} />
                  )}
                </Box>

                <Box>
                  <CustomDropdown
                    name="driver_id"
                    title="Select Vehicle Driver"
                    options={driversOptions}
                    value={useMemoized(
                      driversOptions?.find((item) => item.value === values.driver_id),
                      [driversOptions, values.driver_id]
                    )}
                    required
                    placeholder="Select Driver"
                    onValueChange={(driver_id) => {
                      setFieldTouched('driver_id', true);
                      setFieldValue('driver_id', driver_id.value);
                    }}
                  />
                  {touched.driver_id && errors?.driver_id && <ErrorMsg error={errors.driver_id} />}
                </Box>

                <Box>
                  <CustomDropdown
                    name="vehicle_type_id"
                    title="Vehicle Type"
                    options={vehicleTypesOptions}
                    value={useMemoized(
                      vehicleTypesOptions?.find((item) => item.value === values.vehicle_type_id),
                      [vehicleTypesOptions, values.vehicle_type_id]
                    )}
                    required
                    placeholder="Select Vehicle Type"
                    onValueChange={(data) => {
                      setFieldTouched('vehicle_type_id', true);
                      setFieldValue('vehicle_type_id', data.value);
                    }}
                  />
                  {touched.vehicle_type_id && errors?.vehicle_type_id && (
                    <ErrorMsg error={errors.vehicle_type_id} />
                  )}
                </Box>

                <Box>
                  <CustomDropdown
                    name="status"
                    title="Status"
                    value={vehicleStatusOptions?.find((item) => item.value === values.status)}
                    options={vehicleStatusOptions}
                    placeholder="Select Vehicle Status"
                    onValueChange={(status) => {
                      setFieldTouched('status', true);
                      setFieldValue('status', status.value);
                    }}
                  />
                  {touched.status && errors?.status && <ErrorMsg error={errors.status} />}
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
      )}
    </Formik>
  );
}
