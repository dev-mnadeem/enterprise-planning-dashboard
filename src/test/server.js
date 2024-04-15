import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Fixtures follow the shapes the Adinkra API returns. Names and addresses are
// invented; nothing here comes from a real deployment.
export const adminUser = {
  id: '01HADMIN0000000000000000000',
  name: 'Ama Mensah',
  email: 'ops.lead@example.com',
  user_role: { name: 'admin' },
};

const base64url = (value) =>
  Buffer.from(JSON.stringify(value))
    .toString('base64')
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

// The API puts the user record, JSON-encoded, in the token's `id` claim.
export const makeToken = (user = adminUser) =>
  `${base64url({ alg: 'HS256', typ: 'JWT' })}.${base64url({
    id: JSON.stringify(user),
    exp: 4102444800,
  })}.signature`;

export const usersFixture = [
  {
    id: 'u1',
    name: 'Kofi Boateng',
    email: 'dispatch@example.com',
    phone_number: '+10000000001',
    status: true,
    user_role: { name: 'dispatcher' },
  },
  {
    id: 'u2',
    name: 'Efua Owusu',
    email: 'warehouse@example.com',
    phone_number: '+10000000002',
    status: false,
    user_role: { name: 'warehouse' },
  },
];

export const handlers = [
  // Iconify loads icon sets from its CDN at runtime; tests don't need the glyphs.
  rest.get(/^https:\/\/api\.(iconify\.design|unisvg\.com|simplesvg\.com)\//, (req, res, ctx) =>
    res(ctx.status(404))
  ),
  rest.post(/\/auth\/login\/?$/, async (req, res, ctx) => {
    const { email, password } = await req.json();
    if (email === adminUser.email && password === 'correct-horse') {
      return res(
        ctx.json({
          token: makeToken(),
          permissions: [],
          locations: [{ id: 'loc-1', name: 'Tema Port Warehouse' }],
        })
      );
    }
    return res(ctx.status(401), ctx.json({ message: 'Invalid email or password' }));
  }),
  rest.get(/\/users\/?$/, (req, res, ctx) => res(ctx.json({ results: usersFixture }))),
];

export const server = setupServer(...handlers);
export { rest };
