import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { RouterLink } from 'src/routes/components';
import { ENDPOINTS } from 'src/api/Endpoints';
import { ROUTES } from 'src/constants';
import { useQuery } from 'src/api';
import { fDate } from 'src/utils/format-time';
import ShipmentStageChip, { STAGES } from 'src/components/shipment-stage';

const SAMPLE_SIZE = 100;

export const summariseStages = (orders = []) => {
  const counts = orders.reduce((acc, order) => {
    const stage = order?.history?.[0]?.status || 'booked';
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {});
  return [
    { key: 'booked', label: 'Booked, not yet received', count: counts.booked || 0 },
    { key: 'in', label: STAGES.in.long, count: counts.in || 0 },
    { key: 'out', label: STAGES.out.long, count: counts.out || 0 },
  ];
};

const route = (order) =>
  [order?.sender_city?.name, order?.receiver_city?.name].map((city) => city || '?').join(' → ');

export default function RecentShipments() {
  const { data, loading, error } = useQuery(`${ENDPOINTS.ORDERS}?pageSize=${SAMPLE_SIZE}`);
  const orders = data?.results || [];
  const stages = summariseStages(orders);
  const sampled = orders.length;

  if (loading && !data) {
    return <Skeleton variant="rounded" height={320} />;
  }

  if (error) {
    return (
      <Card sx={{ p: 3 }}>
        <Typography variant="subtitle1">Shipments</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`Couldn't load shipments: ${error}`}
        </Typography>
      </Card>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' },
        alignItems: 'start',
      }}
    >
      <Card component="section" aria-labelledby="latest-shipments">
        <CardHeader
          title="Latest shipments"
          titleTypographyProps={{ id: 'latest-shipments', component: 'h2', variant: 'h6' }}
          action={
            <Link component={RouterLink} href={ROUTES.ORDERS} variant="subtitle2">
              All shipments
            </Link>
          }
        />
        {orders.length === 0 ? (
          <Typography sx={{ px: 3, pb: 3, color: 'text.secondary' }}>
            No shipments booked yet.
          </Typography>
        ) : (
          <Stack component="ol" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {orders.slice(0, 6).map((order) => (
              <Box
                component="li"
                key={order.id}
                sx={{
                  px: 3,
                  py: 1.5,
                  display: 'grid',
                  gap: 1,
                  gridTemplateColumns: { xs: '1fr', sm: '10rem 1fr auto' },
                  alignItems: 'center',
                  justifyItems: { xs: 'start', sm: 'stretch' },
                  borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Link
                  component={RouterLink}
                  href={`${ROUTES.ORDERS}/${order.id}`}
                  variant="subtitle2"
                  sx={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}
                >
                  {order.order_number}
                </Link>
                <Box sx={{ minWidth: 0, maxWidth: 1 }}>
                  <Typography variant="body2" noWrap>
                    {route(order)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {`${order.sender_name || 'Unknown sender'} · ${fDate(
                      order.created_at,
                      'dd MMM yyyy'
                    )}`}
                  </Typography>
                </Box>
                <Box sx={{ justifySelf: { sm: 'end' } }}>
                  <ShipmentStageChip scan={order?.history?.[0]} />
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </Card>

      <Card component="section" aria-labelledby="shipment-stages" sx={{ p: 3 }}>
        <Typography id="shipment-stages" variant="h6" component="h2">
          Where shipments are
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          {sampled === SAMPLE_SIZE
            ? `Latest ${SAMPLE_SIZE} shipments, by their most recent scan`
            : `All ${sampled} shipments, by their most recent scan`}
        </Typography>
        <Stack spacing={2.5}>
          {stages.map((stage) => {
            const share = sampled ? Math.round((stage.count / sampled) * 100) : 0;
            return (
              <Box key={stage.key}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                  <Typography variant="body2">{stage.label}</Typography>
                  <Typography variant="subtitle2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                    {stage.count}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={share}
                  color={STAGES[stage.key]?.color || 'inherit'}
                  aria-label={`${stage.label}: ${share}%`}
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            );
          })}
        </Stack>
      </Card>
    </Box>
  );
}
