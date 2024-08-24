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
  ListSubheader,
  Typography,
} from '@mui/material';
import { CustomDropdown, InputField } from '../common';
import { SHIPMENT_DISPATCH } from 'src/constants';
import _ from 'lodash';
import Iconify from '../iconify/iconify';
import useMemoized from 'src/hooks/useMemoized';
import { useLazyQuery, useMutation } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from 'src/state/hooks';
import toast from 'react-hot-toast';
import { Error, HighlightOff, Inventory } from '@mui/icons-material';

export default function OrderInForm({ onSubmit, initials, viewOnly, buttonText }) {
  const location = useLocation();
  const [orderNumbers, setOrderNumbers] = useState([]);
  const [invalidOrderNumbers, setInvalidOrderNumbers] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');
  const [initialValues, setInitialValues] = useState({ ...initials });
  const { user } = useAppSelector((state) => state.userReducer);
  const { IN } = SHIPMENT_DISPATCH;

  const orderEndPoint = ENDPOINTS.ORDERS;
  const [validateOrder] = useLazyQuery(orderEndPoint);
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
      handleAddOrderNo(order?.order_number);
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
    if (updatedOrder?.success?.length) {
      toast.success('Shipments Intake Successfull!');
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, '', url);
      setInitialValues((initials) => ({ ...initials, orderNo: '' }));
      setOrderNumbers([]);
      setInvalidOrderNumbers([]);
    }
  }, [updatedOrder]);

  const handleAddOrderNo = async (orderNo) => {
    const _orderNumber = orderNo.trim();
    if (_orderNumber !== '') {
      await validateOrder({}, `${orderNo}/in/is-valid`).then((res) => {
        if (res?.is_valid) {
          setOrderNumbers((orderNumbers) => [...new Set([...orderNumbers, _orderNumber])]);
        } else {
          const _invalidOrders = invalidOrderNumbers?.filter(
            (item) => item.orderNo !== _orderNumber
          );
          setInvalidOrderNumbers([..._invalidOrders, { ...res, orderNo: _orderNumber }]);
        }
      });
    }
  };

  const handleRemoveOrder = (index) => {
    const newList = orderNumbers?.filter((_, i) => i !== index);
    setOrderNumbers(newList);
  };

  const onSubmitForm = (values) => {
    if (!orderNumbers?.length || !values.location_id) return;

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
                    title="Tracking Number"
                    name="orderNo"
                    required
                    autoFocus
                    autoComplete="off"
                    value={values?.orderNo}
                    placeholder="Type tracking number and press enter"
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

              {orderNumbers?.length || invalidOrderNumbers?.length ? (
                <Box className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 max-h-[35vh] overflow-y-scroll">
                  <List
                    style={{ marginTop: '20px', padding: '10px' }}
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        Verified Shipments
                      </ListSubheader>
                    }
                  >
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
                        <Inventory className="mr-4" color="primary" />
                        <ListItemText primary={number} />
                      </ListItem>
                    ))}
                  </List>

                  <List
                    style={{ marginTop: '20px', padding: '10px' }}
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        Invalid Shipments
                      </ListSubheader>
                    }
                  >
                    {invalidOrderNumbers?.map((item, index) => (
                      <ListItem key={index} className="mt-2" sx={{ backgroundColor: '#f5f5f5' }}>
                        <Error className="mr-4" color="error" />
                        <ListItemText primary={item?.orderNo} secondary={item?.message} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ) : (
                <></>
              )}

              <Divider className="my-4" />

              <Box className="flex justify-between items-center">
                <Box>
                  <Typography variant="body1" className="mb-4" color="success">
                    Total Verified Shipments: {orderNumbers?.length || 0}
                  </Typography>

                  <Typography variant="body1" className="mb-4" color="error">
                    Total Invalid Shipments: {invalidOrderNumbers?.length || 0}
                  </Typography>
                </Box>

                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  className="col-span-2"
                  color="inherit"
                  sx={{
                    padding: '12px 16px',
                    float: 'right',
                  }}
                  startIcon={<Iconify icon="eva:navigation-2-outline" />}
                >
                  INTAKE SHIPMENT
                </Button>
              </Box>
            </fieldset>
          </form>
        </Card>
      )}
    </Formik>
  );
}
