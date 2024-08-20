import SvgColor from 'src/components/svg-color';
import { PERMISSION_ENTITIES, PERMISSION_TYPE, ROUTES } from 'src/constants';
import {
  ViewInAr,
  LocationOn,
  People,
  LockPerson,
  Security,
  PriceChange,
  AirportShuttle,
  AirplaneTicket,
  FlightTakeoff,
  LibraryAdd,
  AddBusiness,
} from '@mui/icons-material';
import { checkCurrentUserPermission } from 'src/utils';
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = (permissions = []) => {
  const { REMOVE, UPDATE, VIEW } = PERMISSION_TYPE;
  const { USER, ORDER, PACKAGING, PRICING, LOCATION, VEHICLE } = PERMISSION_ENTITIES;
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

  if (checkCurrentUserPermission(permissions, ORDER, VIEW)) {
    _currentUserNav.push({
      title: 'Shipments',
      path: '#',
      icon: <AirplaneTicket />,
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
      icon: <LocationOn />,
    });
  }

  if (checkCurrentUserPermission(permissions, VEHICLE, VIEW)) {
    _currentUserNav.push({
      title: 'Vehicles',
      path: ROUTES.VEHICLES,
      icon: <AirportShuttle />,
    });
  }

  /** UPDATE LATER */
  if (checkCurrentUserPermission(permissions, USER, REMOVE)) {
    _currentUserNav.push(
      {
        title: 'Reports',
        path: '/#',
        icon: icon('ic_blog'),
      },
      {
        title: 'Transactions',
        path: '/#',
        icon: icon('ic_lock'),
      },
      {
        title: 'Settings',
        path: '/#',
        icon: icon('ic_disabled'),
      }
    );
  }

  return _currentUserNav;
};

// const navConfig1 = [
//   {
//     title: 'dashboard',
//     path: '/',
//     icon: icon('ic_analytics'),
//   },
//   {
//     title: 'Access Control',
//     path: '#',
//     icon: <Security />,
//     menuItems: [
//       {
//         title: 'Users',
//         path: ROUTES.USERS,
//         icon: <People />,
//       },
//       {
//         title: 'Roles',
//         path: ROUTES.USER_ROLES,
//         icon: <LockPerson />,
//       },
//       // {
//       //   title: 'Permissions',
//       //   path: ROUTES.PERMISSIONS,
//       //   icon: icon('ic_user'),
//       // },
//     ],
//   },
//   {
//     title: 'Shipments',
//     path: '#',
//     icon: <AirplaneTicket />,
//     menuItems: [
//       {
//         title: 'Catalogue',
//         path: ROUTES.ORDERS,
//         icon: <AddBusiness />,
//       },
//       {
//         title: 'Intake',
//         path: ROUTES.ORDER_INTAKE,
//         icon: <LibraryAdd />,
//       },
//       {
//         title: 'Dispatch',
//         path: ROUTES.ORDER_DISPATCH,
//         icon: <FlightTakeoff />,
//       },
//     ],
//   },
//   {
//     title: 'Packagings',
//     path: ROUTES.PACKAGINGS,
//     icon: <ViewInAr />,
//   },
//   {
//     title: 'Pricings',
//     path: ROUTES.PRICING,
//     icon: <PriceChange />,
//   },
//   {
//     title: 'Locations',
//     path: ROUTES.LOCATIONS,
//     icon: <LocationOn />,
//   },
//   {
//     title: 'Vehicles',
//     path: ROUTES.VEHICLES,
//     icon: <AirportShuttle />,
//   },
//   {
//     title: 'Reports',
//     path: '/#',
//     icon: icon('ic_blog'),
//   },
//   {
//     title: 'Transactions',
//     path: '/#',
//     icon: icon('ic_lock'),
//   },
//   {
//     title: 'Settings',
//     path: '/#',
//     icon: icon('ic_disabled'),
//   },
// ];

export default navConfig;
