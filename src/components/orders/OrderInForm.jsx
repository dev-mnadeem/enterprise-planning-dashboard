import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import ErrorMsg from '../error-msg';
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { CustomDropdown, InputField } from '../common';
import { SHIPMENT_DISPATCH, shipmentInSchema } from 'src/constants';
import _ from 'lodash';
import Iconify from '../iconify/iconify';
import useMemoized from 'src/hooks/useMemoized';
import { useLazyQuery, useMutation } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from 'src/state/hooks';
import toast from 'react-hot-toast';
import { Delete, HighlightOff, Inventory } from '@mui/icons-material';

export default function OrderInForm({ onSubmit, initials, viewOnly, buttonText }) {
  const location = useLocation();
  const [orderNumbers, setOrderNumbers] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');
  const [initialValues, setInitialValues] = useState({ ...initials });
  const { user } = useAppSelector((state) => state.userReducer);
  const { IN } = SHIPMENT_DISPATCH;

  const orderEndPoint = ENDPOINTS.ORDERS;
  const [inOrderMutate, { data: updatedOrder, error: orderInError }] = useMutation(orderEndPoint);
  const [getOrderById, { data: order, loading: queryLoading, error: orderError }] =
    useLazyQuery(orderEndPoint);

  useEffect(() => {
    if (user?.locations?.length) {
      setInitialValues((initials) => ({ ...initials, location_id: user?.locations[0]?.id }));
    } else {
      toast.error("You don't have any location assigned. Contact your manager!");
    }
  }, [user?.locations?.length]);

  useEffect(() => {
    if (orderId) {
      getOrderById({}, `${orderId}`);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderError) {
      toast.error(orderError || 'Something went wrong!');
      return;
    }

    if (order) {
      setInitialValues((initials) => ({ ...initials, orderNo: order?.order_number }));
    }
  }, [order, orderError]);

  useEffect(() => {
    if (orderInError) {
      toast.error(orderInError || 'Something went wrong!');
    }
  }, [orderInError]);

  const branchesOptions = useMemoized(
    user?.locations?.map((location) => ({ value: location.id, label: location.name })),
    [user?.locations]
  );

  useEffect(() => {
    if (updatedOrder?.order_id) {
      toast.success('Shipment Intake Successfull!');
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, '', url);
      setInitialValues((initials) => ({ ...initials, orderNo: '' }));
    }
  }, [updatedOrder]);

  const handleAddOrderNo = (orderNo) => {
    if (orderNo.trim() !== '') {
      setOrderNumbers((orderNumbers) => [...new Set([...orderNumbers, orderNo.trim()])]);
    }
  };

  const handleRemoveOrder = (index) => {
    const newList = orderNumbers?.filter((_, i) => i !== index);
    setOrderNumbers(newList);
  };

  const onSubmitForm = (values) => {
    console.log('orderNumbers', orderNumbers);
    console.log('Values', values);
    inOrderMutate(
      {
        order_numbers: orderNumbers,
        location_id: values.location_id,
      },
      'post',
      `${IN}`
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      onSubmit={onSubmitForm}
      // validationSchema={shipmentInSchema}
      initialValues={initialValues}
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
              <Typography variant="h4" className="mb-4">
                Shipment Intake:{' '}
              </Typography>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                <Box>
                  <InputField
                    title="Shipment Number"
                    name="orderNo"
                    required
                    value={values.orderNo}
                    placeholder="17233546..."
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleAddOrderNo(event.target.value);
                        setFieldValue('orderNo', '');
                      }
                    }}
                    onChange={handleChange}
                  />

                  {touched.orderNo && errors?.orderNo && <ErrorMsg error={errors.orderNo} />}
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
              </div>

              <List style={{ marginTop: '20px', padding: '10px', width: '50%' }}>
                {orderNumbers?.map((number, index) => (
                  <ListItem
                    key={index}
                    className="mt-2"
                    sx={{ backgroundColor: '#f5f5f5' }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveOrder(index)}
                      >
                        <HighlightOff />
                      </IconButton>
                    }
                  >
                    <Inventory className="mr-4" />
                    <ListItemText primary={number} />
                  </ListItem>
                ))}
              </List>

              <Divider className="my-4" />

              <Button
                onClick={handleSubmit}
                variant="contained"
                className="col-span-2 mt-6"
                color="inherit"
                sx={{
                  padding: '12px 16px',
                  float: 'right',
                }}
                startIcon={<Iconify icon="eva:navigation-2-outline" />}
              >
                INTAKE SHIPMENT
              </Button>
            </fieldset>
          </form>
        </Card>
      )}
    </Formik>
  );
}
