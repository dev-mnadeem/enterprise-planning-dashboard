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
import { SHIPMENT_DISPATCH, shipmentOutSchema } from 'src/constants';
import _ from 'lodash';
import Iconify from '../iconify/iconify';
import useMemoized from 'src/hooks/useMemoized';
import { useLazyQuery, useMutation, useQuery } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from 'src/state/hooks';
import toast from 'react-hot-toast';
import { Error, HighlightOff, Inventory } from '@mui/icons-material';

export default function OrderOutForm({ onSubmit, initials, viewOnly, buttonText }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');
  const [initialValues, setInitialValues] = useState({ ...initials });
  const { user } = useAppSelector((state) => state.userReducer);
  const [orderNumbers, setOrderNumbers] = useState([]);
  const [invalidOrderNumbers, setInvalidOrderNumbers] = useState([]);
  const { OUT } = SHIPMENT_DISPATCH;
  const orderEndPoint = ENDPOINTS.ORDERS;
  const [outOrderMutate, { data: updatedOrder, error: orderOutError }] = useMutation(orderEndPoint);
  const [getOrderById, { data: order, loading: queryLoading, error: orderError }] =
    useLazyQuery(orderEndPoint);
  const { error: locationError, data: locations } = useQuery(ENDPOINTS.LOCATIONS);
  const { error: vehiclesError, data: vehicles } = useQuery(ENDPOINTS.VEHICLES);
  const [validateOrder] = useLazyQuery(orderEndPoint);

  useEffect(() => {
    if (user?.locations?.length) {
      setInitialValues((initials) => ({ ...initials, from_location_id: user?.locations[0]?.id }));
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
    if (orderOutError) {
      toast.error(orderOutError || 'Something went wrong!');
    }
  }, [orderOutError]);

  const fromLocationOptions = useMemoized(
    user?.locations?.map((location) => ({ value: location.id, label: location.name })),
    [user?.locations]
  );

  const toLocationsOptions = useMemoized(
    locations?.map((location) => ({ value: location.id, label: location.name })),
    [locations]
  );

  const vehiclesOptions = useMemoized(
    vehicles?.map((vehicle) => ({
      value: vehicle.id,
      label: `${vehicle?.name} (${vehicle?.registration_number})`,
    })),
    [vehicles]
  );

  const conveyanceByOptions = useMemoized(
    ['Container', 'Vehicle'].map((type) => ({ value: type, label: type })),
    []
  );

  useEffect(() => {
    if (updatedOrder?.success?.length) {
      toast.success('Shipment Dispatch Successfull!');
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, '', url);
      setInitialValues((initials) => ({ ...initials, orderNo: '' }));
      setInvalidOrderNumbers([]);
      setOrderNumbers([]);
    }
  }, [updatedOrder]);

  const handleAddOrderNo = async (orderNo) => {
    const _orderNumber = orderNo.trim();
    if (_orderNumber !== '') {
      await validateOrder({}, `${orderNo}/out/is-valid`).then((res) => {
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
    if (!orderNumbers?.length || !values.from_location_id || !values?.vehicle_id) {
      toast.error('Please select required fields!');
      return;
    }

    outOrderMutate(
      {
        order_numbers: orderNumbers,
        from_location_id: values.from_location_id,
        to_location_id: values.to_location_id,
        vehicle_id: values.vehicle_id,
      },
      'post',
      `${OUT}`
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      onSubmit={onSubmitForm}
      // validationSchema={shipmentOutSchema}
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
                Shipment Dispatch:{' '}
              </Typography>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                <Box className="col-span-2 w-1/2">
                  <InputField
                    title="Tracking Number"
                    name="orderNo"
                    required
                    autoFocus
                    autoComplete="off"
                    value={values.orderNo}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleAddOrderNo(event.target.value);
                        setFieldValue('orderNo', '');
                      }
                    }}
                    placeholder="Type tracking number and press enter"
                    onChange={handleChange}
                  />

                  {touched.orderNo && errors?.orderNo && <ErrorMsg error={errors.orderNo} />}
                </Box>

                <Box>
                  <CustomDropdown
                    title="From Branch/Frenchise"
                    name="from_location_id"
                    required
                    placeholder="Select Location"
                    options={fromLocationOptions}
                    value={useMemoized(
                      fromLocationOptions?.find((item) => item.value === values.from_location_id) ||
                        null,
                      [fromLocationOptions, values.from_location_id]
                    )}
                    onValueChange={async (value) => {
                      setFieldTouched('from_location_id', true);
                      setFieldValue('from_location_id', value.value);
                    }}
                  />
                  {touched.from_location_id && errors?.from_location_id && (
                    <ErrorMsg error={errors.from_location_id} />
                  )}
                </Box>

                <Box>
                  <CustomDropdown
                    title="To Branch/Frenchise"
                    name="to_location_id"
                    placeholder="Select Location"
                    options={toLocationsOptions}
                    value={useMemoized(
                      toLocationsOptions?.find((item) => item.value === values.to_location_id) ||
                        null,
                      [toLocationsOptions, values.to_location_id]
                    )}
                    onValueChange={async (value) => {
                      setFieldTouched('to_location_id', true);
                      setFieldValue('to_location_id', value.value);
                    }}
                  />
                  {touched.to_location_id && errors?.to_location_id && (
                    <ErrorMsg error={errors.to_location_id} />
                  )}
                </Box>

                <Box>
                  <CustomDropdown
                    name="conveyanceType"
                    title="Conveyance Type"
                    options={conveyanceByOptions}
                    value={useMemoized(
                      conveyanceByOptions?.find((item) => item.value === values.conveyanceType),
                      [conveyanceByOptions, values.conveyanceType]
                    )}
                    required
                    placeholder="Select Conveyance through"
                    onValueChange={(conveyanceType) => {
                      setFieldTouched('conveyanceType', true);
                      setFieldValue('conveyanceType', conveyanceType.value);
                    }}
                  />
                  {touched.conveyanceType && errors?.conveyanceType && (
                    <ErrorMsg error={errors.conveyanceType} />
                  )}
                </Box>

                {values?.conveyanceType == 'Vehicle' ? (
                  <Box>
                    <CustomDropdown
                      title="From Transport Vehicle"
                      name="vehicle_id"
                      required
                      placeholder="Select Vehicle"
                      options={vehiclesOptions}
                      value={
                        vehiclesOptions?.find((item) => item.value === values.vehicle_id) || null
                      }
                      onValueChange={async (value) => {
                        setFieldTouched('vehicle_id', true);
                        setFieldValue('vehicle_id', value.value);
                      }}
                    />
                    {touched.vehicle_id && errors?.vehicle_id && (
                      <ErrorMsg error={errors.vehicle_id} />
                    )}
                  </Box>
                ) : (
                  <Box>
                    <CustomDropdown
                      title="From Container"
                      name="vehicle_id"
                      required
                      placeholder="Select Container"
                      options={vehiclesOptions}
                      value={
                        vehiclesOptions?.find((item) => item.value === values.vehicle_id) || null
                      }
                      onValueChange={async (value) => {
                        setFieldTouched('vehicle_id', true);
                        setFieldValue('vehicle_id', value.value);
                      }}
                    />
                    {touched.vehicle_id && errors?.vehicle_id && (
                      <ErrorMsg error={errors.vehicle_id} />
                    )}
                  </Box>
                )}
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

              <Button
                variant="contained"
                className="col-span-2 mt-6"
                onClick={handleSubmit}
                color="inherit"
                sx={{
                  padding: '12px 16px',
                  float: 'right',
                }}
                startIcon={<Iconify icon="eva:navigation-2-outline" />}
              >
                DISPATCH SHIPMENT
              </Button>
            </fieldset>
          </form>
        </Card>
      )}
    </Formik>
  );
}
