import SvgColor from 'src/components/svg-color';

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
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Shipments',
    path: '/#',
    icon: icon('ic_cart'),
  },
  {
    title: 'Locations',
    path: '/locations',
    icon: icon('ic_locations'),
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
