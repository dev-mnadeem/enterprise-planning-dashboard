import navConfig from './config-navigation';

const titles = (permissions) => navConfig(permissions).map((item) => item.title);

it('shows only the sections a role can view', () => {
  expect(
    titles([
      { name: 'Order', properties: { view: true } },
      { name: 'Vehicle', properties: { view: false } },
    ])
  ).toEqual(['dashboard', 'Shipments']);
});

it('shows access control to roles that can update users', () => {
  expect(titles([{ name: 'User', properties: { update: true } }])).toContain('Access Control');
});
