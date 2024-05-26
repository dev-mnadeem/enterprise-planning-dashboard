export const ROUTES = {
  LOGIN: '/login',
  USERS: '/users',
  LOCATIONS: '/locations',
  ADD_USER: '/users/add',
  ADD_LOCATION: '/locations/add',
  PERMISSIONS: '/permissions',
  USER_ROLES: '/user-roles',
  ADD_USER_ROLE: '/user-roles/add',
  SHIPMENTS: '/shipments',
  ADD_SHIPMENT: '/shipments/add',
};

export const PERMISSION_TYPE = {
  ADD: 'add',
  VIEW: 'view',
  REMOVE: 'remove',
  UPDATE: 'update',
};

export * from './yupValidations';
