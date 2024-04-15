import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useAppSelector } from 'src/state/hooks';
import { ENDPOINTS } from 'src/api/Endpoints';
import { PERMISSION_ENTITIES, PERMISSION_TYPE, ROUTES } from 'src/constants';
import { checkCurrentUserPermission } from 'src/utils';
import { fDate } from 'src/utils/format-time';
import LedgerStrip, { LedgerCell } from '../ledger-strip';
import RecentShipments from '../recent-shipments';

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

export default function AppView() {
  const { user } = useAppSelector((state) => state.userReducer);
  const isAdmin = user?.user_role?.name === 'admin';
  const can = (entity) =>
    checkCurrentUserPermission(
      user?.permissions,
      entity,
      PERMISSION_TYPE.VIEW,
      isAdmin ? 'admin' : ''
    );
  const { ORDER, VEHICLE, LOCATION, CONTAINER } = PERMISSION_ENTITIES;
  const home = user?.locations?.[0]?.name;

  return (
    <Container maxWidth="xl">
      <Stack spacing={0.5} sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Operations overview
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {[fDate(new Date(), 'EEEE d MMMM yyyy'), home && `Working from ${home}`]
            .filter(Boolean)
            .join(' · ')}
        </Typography>
      </Stack>

      <Stack spacing={3}>
        <LedgerStrip>
          {can(ORDER) && (
            <LedgerCell
              label="Shipments"
              endpoint={`${ENDPOINTS.ORDERS}?pageSize=1`}
              select={(data) => ({ value: data?.pageInfo?.totalResults ?? 0 })}
              caption="Booked across your locations"
              to={ROUTES.ORDERS}
            />
          )}
          {can(VEHICLE) && (
            <LedgerCell
              label="Vehicles"
              endpoint={ENDPOINTS.VEHICLES}
              select={(data) => ({
                value: data.filter((vehicle) => vehicle.status).length,
                caption: `active of ${plural(data.length, 'vehicle')}`,
              })}
              to={ROUTES.VEHICLES}
            />
          )}
          {can(LOCATION) && (
            <LedgerCell
              label="Locations"
              endpoint={ENDPOINTS.LOCATIONS}
              select={(data) => ({
                value: data.length,
                caption: 'Warehouses, branches and franchises',
              })}
              to={ROUTES.LOCATIONS}
            />
          )}
          {can(CONTAINER) && (
            <LedgerCell
              label="Containers"
              endpoint={ENDPOINTS.CONTAINERS}
              select={(data) => ({ value: data.length, caption: 'Registered for sea freight' })}
              to={ROUTES.CONTAINERS}
            />
          )}
        </LedgerStrip>

        {can(ORDER) && <RecentShipments />}
      </Stack>
    </Container>
  );
}
