import { checkCurrentUserPermission, removeFalsePermissions, sumSafely } from './common';

const permissions = [
  { name: 'Vehicle', properties: { view: true, update: false } },
  { name: 'Order', properties: { view: true, add: true } },
];

describe('checkCurrentUserPermission', () => {
  it('grants an action the role has', () => {
    expect(checkCurrentUserPermission(permissions, 'Order', 'add')).toBe(true);
  });

  it('refuses an action that is present but false', () => {
    expect(checkCurrentUserPermission(permissions, 'Vehicle', 'update')).toBe(false);
  });

  it('refuses an entity the role does not list', () => {
    expect(checkCurrentUserPermission(permissions, 'User', 'view')).toBe(false);
  });

  it('lets admins through regardless of the list', () => {
    expect(checkCurrentUserPermission([], 'User', 'remove', 'admin')).toBe(true);
  });
});

it('removeFalsePermissions keeps only granted actions', () => {
  expect(removeFalsePermissions(permissions)).toEqual([
    { name: 'Vehicle', properties: { view: true } },
    { name: 'Order', properties: { view: true, add: true } },
  ]);
});

it('sumSafely ignores blanks and non-numbers', () => {
  expect(sumSafely(0, '10.5', '', undefined, 'x', 4)).toBeCloseTo(14.5);
});
