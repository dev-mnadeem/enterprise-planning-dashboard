import {
  checkCurrentUserPermission,
  calculateRemainingWeightLimit,
  formattedPermissionsData,
} from './common';

test('permissions deny missing roles and missing operations', () => {
  expect(checkCurrentUserPermission(undefined, 'shipments', 'view')).toBe(false);
  const permissions = [{ name: 'shipments', properties: { view: true, remove: false } }];
  expect(checkCurrentUserPermission(permissions, 'shipments', 'view')).toBe(true);
  expect(checkCurrentUserPermission(permissions, 'shipments', 'remove')).toBe(false);
  expect(checkCurrentUserPermission(permissions, 'users', 'view')).toBe(false);
});

test('admin access does not depend on individual permission rows', () => {
  expect(checkCurrentUserPermission([], 'users', 'remove', 'admin')).toBe(true);
});

test('permission form defaults unspecified operations to denied', () => {
  expect(formattedPermissionsData({ shipments: { view: true } }, [{ name: 'shipments' }]))
    .toEqual([{ name: 'shipments', properties: { add: false, view: true, update: false, remove: false } }]);
});

test('parcel capacity excludes the row being edited and never goes negative', () => {
  const values = { orderItems: [{ weight: 30 }, { weight: '15' }, { weight: 10 }] };
  expect(calculateRemainingWeightLimit(values, 0, 40)).toBe(15);
  expect(calculateRemainingWeightLimit(values, 0, 20)).toBe(0);
});
