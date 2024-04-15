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

export const ordersFixture = [
  {
    id: 'o1',
    order_number: 'ACM-240311-0042',
    sender_name: 'Abena Asante',
    created_at: '2026-03-11T09:30:00Z',
    sender_city: { name: 'Kumasi' },
    receiver_city: { name: 'Rotterdam' },
    history: [{ status: 'out', name: 'Tema Port Warehouse' }],
  },
  {
    id: 'o2',
    order_number: 'ACM-240311-0043',
    sender_name: 'Yaw Darko',
    created_at: '2026-03-11T10:05:00Z',
    sender_city: { name: 'Accra' },
    receiver_city: { name: 'London' },
    history: [{ status: 'in', name: 'Accra Branch' }],
  },
  {
    id: 'o3',
    order_number: 'ACM-240312-0001',
    sender_name: 'Akosua Frimpong',
    created_at: '2026-03-12T08:00:00Z',
    sender_city: { name: 'Takoradi' },
    receiver_city: { name: 'Hamburg' },
    history: [],
  },
];

// Mirrors the API's paging: 1-based pageNumber, pageSize, and a name search.
export const pageOf = (records, searchParams) => {
  const search = (searchParams.get('search') || '').toLowerCase();
  const pageNumber = Number(searchParams.get('pageNumber') || 1);
  const pageSize = Number(searchParams.get('pageSize') || 10);
  const matching = records.filter((r) => !search || r.name.toLowerCase().includes(search));
  return {
    pageInfo: {
      pageNumber,
      pageSize,
      totalPages: Math.ceil(matching.length / pageSize),
      totalResults: matching.length,
    },
    results: matching.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
  };
};

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
  rest.get(/\/orders\/?$/, (req, res, ctx) =>
    res(
      ctx.json({
        ...pageOf(
          ordersFixture.map((o) => ({ ...o, name: o.order_number })),
          req.url.searchParams
        ),
      })
    )
  ),
  rest.get(/\/vehicles\/?$/, (req, res, ctx) =>
    res(
      ctx.json([
        { id: 'v1', name: 'Hino 500', status: true },
        { id: 'v2', name: 'Isuzu NPR', status: true },
        { id: 'v3', name: 'Tata LPT', status: false },
      ])
    )
  ),
  rest.get(/\/locations\/?$/, (req, res, ctx) =>
    res(ctx.json([{ id: 'loc-1', name: 'Tema Port Warehouse' }]))
  ),
  rest.get(/\/containers\/?$/, (req, res, ctx) => res(ctx.json([]))),
  rest.get(/\/users\/?$/, (req, res, ctx) =>
    res(ctx.json(pageOf(usersFixture, req.url.searchParams)))
  ),
];

export const server = setupServer(...handlers);
export { rest };
