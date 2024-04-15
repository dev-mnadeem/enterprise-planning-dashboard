import SvgColor from 'src/components/svg-color';
import { PERMISSION_ENTITIES, PERMISSION_TYPE, ROUTES } from 'src/constants';
import {
  ViewInAr,
  People,
  LockPerson,
  Security,
  PriceChange,
  FlightTakeoff,
  LibraryAdd,
  AddBusiness,
} from '@mui/icons-material';
import { checkCurrentUserPermission } from 'src/utils';
import { Icon } from '@iconify/react';
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = (permissions = []) => {
  const { UPDATE, VIEW } = PERMISSION_TYPE;
  const { USER, ORDER, PACKAGING, PRICING, LOCATION, VEHICLE, CONTAINER } = PERMISSION_ENTITIES;
  const _currentUserNav = [];

  _currentUserNav.push({
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  });

  if (checkCurrentUserPermission(permissions, USER, UPDATE)) {
    _currentUserNav.push({
      title: 'Access Control',
      path: '#',
      icon: <Security />,
      menuItems: [
        {
          title: 'Users',
          path: ROUTES.USERS,
          icon: <People />,
        },
        {
          title: 'Roles',
          path: ROUTES.USER_ROLES,
          icon: <LockPerson />,
        },
      ],
    });
  }

  if (checkCurrentUserPermission(permissions, PACKAGING, VIEW)) {
    _currentUserNav.push({
      title: 'Packagings',
      path: ROUTES.PACKAGINGS,
      icon: <ViewInAr />,
    });
  }

  if (checkCurrentUserPermission(permissions, PRICING, VIEW)) {
    _currentUserNav.push({
      title: 'Pricings',
      path: ROUTES.PRICING,
      icon: <PriceChange />,
    });
  }

  if (checkCurrentUserPermission(permissions, CONTAINER, VIEW)) {
    _currentUserNav.push({
      title: 'Containers',
      path: ROUTES.CONTAINERS,
      icon: <Icon icon="charm:container" width={25} height={25} />,
    });
  }

  if (checkCurrentUserPermission(permissions, ORDER, VIEW)) {
    _currentUserNav.push({
      title: 'Shipments',
      path: '#',
      icon: <Icon icon="game-icons:cargo-ship" width="25" height="25" />,
      menuItems: [
        {
          title: 'Catalogue',
          path: ROUTES.ORDERS,
          icon: <AddBusiness />,
        },
        {
          title: 'Intake',
          path: ROUTES.ORDER_INTAKE,
          icon: <LibraryAdd />,
        },
        {
          title: 'Dispatch',
          path: ROUTES.ORDER_DISPATCH,
          icon: <FlightTakeoff />,
        },
      ],
    });
  }

  if (checkCurrentUserPermission(permissions, LOCATION, VIEW)) {
    _currentUserNav.push({
      title: 'Locations',
      path: ROUTES.LOCATIONS,
      icon: <Icon icon="fluent:globe-location-24-regular" width="25" height="25" />,
    });
  }

  if (checkCurrentUserPermission(permissions, VEHICLE, VIEW)) {
    _currentUserNav.push({
      title: 'Vehicles',
      path: ROUTES.VEHICLES,
      icon: <Icon icon="fa6-solid:truck-fast" width="25" height="25" />,
    });
  }

  return _currentUserNav;
};

export default navConfig;
