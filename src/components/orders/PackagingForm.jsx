import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import ErrorMsg from '../error-msg';
import { Box, Button, Card, Divider, Typography } from '@mui/material';
import { CustomDropdown, InputField } from '../common';
import { SHIPMENT_ROUTE, createPackagingSchema } from 'src/constants';
import _ from 'lodash';
import NumberField from '../common/Input/NumberField';
import Iconify from '../iconify/iconify';
import { ADD_PACKAGING_INITIALS } from 'src/sections/packaging/utils';
import useMemoized from 'src/hooks/useMemoized';

export default function PackagingForm({ onSubmit, initials, viewOnly, buttonText }) {
  const [initialValues, setInitialValues] = useState({ ...initials });
  const { AIR, SEA, ROAD } = SHIPMENT_ROUTE;

  const shipmentByOptions = useMemoized(
    [AIR, SEA, ROAD].map((type) => ({ value: type, label: type })),
    []
  );

  const onSubmitForm = (values) => {
    onSubmit({ ...values });
  };

  return (
    <Formik
      enableReinitialize={true}
      onSubmit={onSubmitForm}
      validationSchema={createPackagingSchema}
      initialValues={initials ? initialValues : ADD_PACKAGING_INITIALS}
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
                  <CustomDropdown
                    name="shipment_path"
                    title="Shipment Route"
                    options={shipmentByOptions}
                    value={useMemoized(
                      shipmentByOptions?.find((item) => item.value === values.shipment_path),
                      [shipmentByOptions, values.shipment_path]
                    )}
                    required
                    placeholder="Select Shipment By"
                    onValueChange={(shipment_path) => {
                      setFieldTouched('shipment_path', true);
                      setFieldValue('shipment_path', shipment_path.value);
                      setFieldValue('weight_type', shipment_path.value === SEA ? 'cbm' : 'kg');
                    }}
                  />
                  {touched.shipment_path && errors?.shipment_path && (
                    <ErrorMsg error={errors.shipment_path} />
                  )}
                </Box>

                <Box className="col-span-1">
                  <InputField
                    title="Package Name"
                    placeholder="i.e, A4 Envelope, Moving box..."
                    name="name"
                    required
                    value={values.name}
                    onChange={handleChange}
                  />
                  {touched.name && errors?.name && <ErrorMsg error={errors.name} />}
                </Box>

                <Typography className="col-span-2 font-bold">
                  Dimensions [Width x Height x Depth] (in) *
                </Typography>

                <Box>
                  <NumberField
                    name="width"
                    title="Width"
                    fullWidth
                    required
                    unit={`in"`}
                    value={values.width}
                    onChange={handleChange}
                  />
                  {touched.width && errors?.width && <ErrorMsg error={errors.width} />}
                </Box>

                <Box>
                  <NumberField
                    name="height"
                    title="Height"
                    required
                    unit={`in"`}
                    value={values.height}
                    onChange={handleChange}
                  />
                  {touched.height && errors?.height && <ErrorMsg error={errors.height} />}
                </Box>

                <Box>
                  <NumberField
                    name="depth"
                    title="Depth"
                    required
                    unit={`in"`}
                    value={values.depth}
                    onChange={handleChange}
                  />
                  {touched.depth && errors?.depth && <ErrorMsg error={errors.depth} />}
                </Box>

                <Box>
                  <NumberField
                    name="weight_limit"
                    title="Weight Limit"
                    unit={values?.weight_type || 'kg'}
                    value={values.weight_limit}
                    onChange={handleChange}
                  />
                  {touched.weight_limit && errors?.weight_limit && (
                    <ErrorMsg error={errors.weight_limit} />
                  )}
                </Box>

                {/* <Box>
                  <NumberField
                    name="price"
                    title="Packaging Price"
                    required
                    unit={`$`}
                    value={values.price}
                    onChange={handleChange}
                  />
                  {touched.price && errors?.price && <ErrorMsg error={errors.price} />}
                </Box> */}
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
