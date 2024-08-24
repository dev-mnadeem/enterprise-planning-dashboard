import { useState } from 'react';
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
        resetForm,
      }) => {
        const isSea = values.route === SEA;
        const unit = isSea ? 'm' : 'in"';

        const onChangeDimensions = (dimension) => {
          if (isSea && dimension?.width && dimension?.height && dimension?.depth) {
            setFieldValue(
              'weight_limit',
              (+dimension?.width * +dimension?.height * +dimension?.depth).toFixed(2)
            );
          }
        };

        const onChangeWeightLimit = (value) => {
          setFieldValue('weight_limit', value);
          if (isSea && value >= 0.0) {
            setFieldValue('width', Math.cbrt(value)?.toFixed(2));
            setFieldValue('height', Math.cbrt(value)?.toFixed(2));
            setFieldValue('depth', Math.cbrt(value)?.toFixed(2));
          }
        };

        return (
          <Card className="p-6">
            <form onSubmit={handleSubmit}>
              <fieldset disabled={viewOnly ?? false} className="border-none">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  <Box>
                    <CustomDropdown
                      name="route"
                      title="Shipment Route"
                      options={shipmentByOptions}
                      value={useMemoized(
                        shipmentByOptions?.find((item) => item.value === values.route),
                        [shipmentByOptions, values.route]
                      )}
                      required
                      placeholder="Select Shipment By"
                      onValueChange={(route) => {
                        resetForm();
                        setFieldTouched('route', true);
                        setFieldValue('route', route.value);
                        setFieldValue('weight_type', route.value === SEA ? 'cbm' : 'kg');
                      }}
                    />
                    {touched.route && errors?.route && <ErrorMsg error={errors.route} />}
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

                  {isSea && (
                    <>
                      <Typography className="col-span-2 font-bold">
                        Dimensions [Width x Height x Depth] *
                      </Typography>
                      <Box>
                        <NumberField
                          name="width"
                          title="Width"
                          fullWidth
                          required
                          unit={`${unit}`}
                          value={values.width}
                          isCustomOnChange={true}
                          onChange={async (event) => {
                            await setFieldValue('width', event.target.value);
                            onChangeDimensions({
                              ...values,
                              width: event.target.value,
                            });
                          }}
                        />
                        {touched.width && errors?.width && <ErrorMsg error={errors.width} />}
                      </Box>

                      <Box>
                        <NumberField
                          name="height"
                          title="Height"
                          required
                          unit={`${unit}`}
                          value={values.height}
                          isCustomOnChange={true}
                          onChange={async (event) => {
                            await setFieldValue('height', event.target.value);
                            onChangeDimensions({
                              ...values,
                              height: event.target.value,
                            });
                          }}
                        />
                        {touched.height && errors?.height && <ErrorMsg error={errors.height} />}
                      </Box>

                      <Box>
                        <NumberField
                          name="depth"
                          title="Depth"
                          required
                          unit={`${unit}`}
                          value={values.depth}
                          isCustomOnChange={true}
                          onChange={async (event) => {
                            await setFieldValue('depth', event.target.value);
                            onChangeDimensions({
                              ...values,
                              depth: event.target.value,
                            });
                          }}
                        />
                        {touched.depth && errors?.depth && <ErrorMsg error={errors.depth} />}
                      </Box>
                    </>
                  )}

                  <Box>
                    <NumberField
                      name="weight_limit"
                      title={`${isSea ? 'Volume' : 'Weight'} Limit`}
                      unit={values?.weight_type || 'kg'}
                      value={values.weight_limit}
                      isCustomOnChange={true}
                      onChange={(e) => onChangeWeightLimit(e.target.value)}
                    />
                    {touched.weight_limit && errors?.weight_limit && (
                      <ErrorMsg error={errors.weight_limit} />
                    )}
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
