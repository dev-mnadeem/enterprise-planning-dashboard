import { ROUTES } from 'src/constants';
import { useNavigate } from 'react-router-dom';
import { CustomChip, OrderCard } from 'src/components/common';
import { customerDetails, shippingDetails, shipmentDetails, orderPaymentDetails } from '../utils';
import { Box, Grid, Stack, Button, Container, Typography } from '@mui/material';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useQuery } from 'src/api';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Print } from '@mui/icons-material';
import OrderHistory from 'src/components/orders/OrderHistory';

export default function OrdersDetailPage({ id }) {
  const navigate = useNavigate();
  const orderEndPoint = `${ENDPOINTS.ORDERS}/${id}`;
  const { data: order, loading: queryLoading, error: orderError } = useQuery(orderEndPoint);

  useEffect(() => {
    if (!order && orderError) {
      toast.error(orderError || 'Something went wrong!');
      navigate(ROUTES.ORDERS);
    }
  }, [order, queryLoading]);

  if (queryLoading) return;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Shipment Details</Typography>
      </Stack>
      <Container>
        <Box className="flex justify-between">
          <Typography variant="h6">
            Shipment# <i>{order?.order_number}</i>
          </Typography>
          <Button
            variant="contained"
            startIcon={<Print />}
            onClick={() => navigate(`${ROUTES.ORDERS}/invoice/${id}`)}
          >
            Print Invoice
          </Button>
        </Box>
        <Box className="flex flex-row gap-3 my-3 bg-transparent">
          <CustomChip
            label={`${order?.history[0]?.status?.toUpperCase() || '--'}, (${
              order?.history[0]?.name || '--'
            })`}
          />
          <CustomChip
            label={`Placed On: ${new Date(order?.createdAt || new Date()).toLocaleString()}`}
            background="#e6eaed"
            color="#374356"
          />
        </Box>
        <Grid container spacing={1} direction="row">
          <Grid item xs={12} md={6} order={{ xs: 1, md: 1 }}>
            <OrderCard data={customerDetails(order)} label="Customer" />
          </Grid>
          <Grid item xs={12} md={6} order={{ xs: 2, md: 2 }}>
            <OrderCard data={shippingDetails(order)} label="Delivery" />
          </Grid>
        </Grid>
        <Container className="mt-3 p-0">
          <OrderCard label="Shipment Details" data={shipmentDetails(order)} />
        </Container>

        <Container className="mt-3 p-0">
          <OrderCard label="Payment Details" data={orderPaymentDetails(order)} />
        </Container>

        <Container className="mt-3 p-0">
          <OrderHistory order={order} />
        </Container>

        <Container className="flex w-full my-3 items-center justify-center">
          <Button onClick={() => navigate(ROUTES.ORDERS)}>Back to Orders</Button>
        </Container>
      </Container>
    </Container>
  );
}
