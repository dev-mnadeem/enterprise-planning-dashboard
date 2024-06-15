export const ROUTES = {
  LOGIN: '/login',
  USERS: '/users',
  LOCATIONS: '/locations',
  ADD_USER: '/users/add',
  ADD_LOCATION: '/locations/add',
  LOCATION_DETIAL: '/locations/:id',
  PERMISSIONS: '/permissions',
  USER_ROLES: '/user-roles',
  ADD_USER_ROLE: '/user-roles/add',
  PACKAGINGS: '/packagings',
  ADD_PACKAGING: '/packagings/add',
  ORDERS: '/orders',
  ADD_ORDER: '/orders/add',
  ORDER_DETAIL: '/orders/:id',
};

export const PERMISSION_TYPE = {
  ADD: 'add',
  VIEW: 'view',
  REMOVE: 'remove',
  UPDATE: 'update',
};

/** PERMISSION KEY VALUES MUST MATCH WITH DB DATA  */
export const PERMISSION_ENTITIES = {
  USER: 'User',
  LOCATION: 'Location',
  USER_ROLE: 'UserRole',
  PERMISSION: 'Permission',
  ORDER: 'Order',
  PACKAGING: 'Package',
};

export * from './yupValidations';

export const NUMBER_FORMATS = {
  DOLLAR: {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
  },
  KG: {
    style: 'unit',
    unit: 'kilogram',
    unitDisplay: 'short',
  },
};
