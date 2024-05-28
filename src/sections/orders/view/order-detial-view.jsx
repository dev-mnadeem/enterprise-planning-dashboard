import { CustomChip, OrderCard } from 'src/components/common';
import { ORDER_ADDRESS, ORDER_DATA, ORDER_AMOUNT } from '../utils';
import { Box, Grid, Stack, Button, Container, Typography } from '@mui/material';

export default function OrdersPage() {
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Order Detail</Typography>
      </Stack>
      <Container>
        <Typography variant="h6">Order# 113212</Typography>
        <Box
          sx={{
            gap: '12px',
            display: 'flex',
            margin: '12px 0px',
            background: 'transparent',
          }}
        >
          <CustomChip label="Ready For Ship" />
          <CustomChip label="Placed On: 2024-05-21" background="#e6eaed" color="#374356" />
        </Box>
        <Grid container spacing={1} direction="row">
          <Grid item xs={12} md={6} order={{ xs: 1, md: 1 }}>
            <OrderCard data={ORDER_DATA} label="Customer & Order" />
          </Grid>
          <Grid item xs={12} md={6} order={{ xs: 2, md: 2 }}>
            <OrderCard data={ORDER_ADDRESS} label="SHIPPING ADDRESS" />
          </Grid>
        </Grid>
        <Container
          sx={{
            marginTop: '12px',
            padding: '0px !important',
          }}
        >
          <OrderCard label="Quantity & Price" data={ORDER_AMOUNT} />
        </Container>

        <Container
          sx={{
            width: '100%',
            display: 'flex',
            margin: ' 12px 0px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button>Back to Orders</Button>
        </Container>
      </Container>
    </Container>
  );
}
