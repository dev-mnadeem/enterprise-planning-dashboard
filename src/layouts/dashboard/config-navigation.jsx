import SvgColor from 'src/components/svg-color';
import { ROUTES } from 'src/constants';
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
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
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
      // {
      //   title: 'Permissions',
      //   path: ROUTES.PERMISSIONS,
      //   icon: icon('ic_user'),
      // },
    ],
  },
  {
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
  },
  {
    title: 'Packagings',
    path: ROUTES.PACKAGINGS,
    icon: <ViewInAr />,
  },
  {
    title: 'Pricings',
    path: ROUTES.PRICING,
    icon: <PriceChange />,
  },
  {
    title: 'Locations',
    path: ROUTES.LOCATIONS,
    icon: <LocationOn />,
  },
  {
    title: 'Vehicles',
    path: ROUTES.VEHICLES,
    icon: <AirportShuttle />,
  },
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
  },
];

export default navConfig;
