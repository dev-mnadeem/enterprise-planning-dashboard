import { forwardRef, useEffect, useState } from 'react';
import { Formik } from 'formik';
import ErrorMsg from '../error-msg';
import {
  Autocomplete,
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
  debounce,
} from '@mui/material';
import { CustomDropdown, InputField } from '../common';
import { createPackagingSchema, userFormValidationSchema } from 'src/constants';
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
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AutoCompleteInput } from '../common/Input/AutoCompleteInput';
import { ADD_SHIPMENT_INITIALS } from 'src/sections/shipments/utils';
import useMemoized from 'src/hooks/useMemoized';
import { ADD_PACKAGING_INITIALS } from 'src/sections/packaging/utils';

export default function PackagingForm({ onSubmit, initials, viewOnly, buttonText }) {
  const [initialValues, setInitialValues] = useState({ ...initials });

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
                    unit={`lbs`}
                    value={values.weight_limit}
                    onChange={handleChange}
                  />
                  {touched.weight_limit && errors?.weight_limit && (
                    <ErrorMsg error={errors.weight_limit} />
                  )}
                </Box>

                <Box>
                  <NumberField
                    name="price"
                    title="Packaging Price"
                    required
                    unit={`$`}
                    value={values.price}
                    onChange={handleChange}
                  />
                  {touched.price && errors?.price && <ErrorMsg error={errors.price} />}
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
