export const ADD_ORDER_INITIALS = {
  sender_name: '',
  sender_email: null,
  sender_phone: '',
  sender_address: '',
  sender_city_id: '',
  receiver_name: '',
  receiver_email: null,
  receiver_phone: '',
  receiver_address: '',
  receiver_city_id: '',
  total_quantity: 0,
  sub_total: 0,
  discount: 0,
  vat: 0,
  other_taxes: 0,
  service_charges: 0,
  total_amount: 0,
  total_weight: 0,
  payment_type: '',
  payment_status: '',
  payment_date: '',
  shipping_date: new Date(),
  collection_time: new Date(),
  status: '',
  location_id: '',
  package_id: '',
  orderItems: [
    {
      name: '',
      quantity: '',
      weight: '',
      description: '',
      courier_type: '',
    },
  ],
};

export const orders = [
  {
    id: 1,
    orderNumber: '#123123',
    trackingNumber: '#1233123',
    from: 'New York, USA',
    to: 'Karachi, Pakistan',
    fromUser: 'John',
    toUser: 'Doe',
    status: 'return_in_progrss',
  },
  {
    id: 2,
    orderNumber: '#2135566',
    trackingNumber: '#123156554',
    from: 'Lahore, Pakistan',
    to: 'Karachi, Pakistan',
    fromUser: 'Smith',
    toUser: 'Johnson',
    status: 'delivered',
  },
  {
    id: 3,
    orderNumber: '#123325632',
    trackingNumber: '#123183132',
    from: 'Karachi, Pakistan',
    to: 'Islamabad, Pakistan',
    fromUser: 'Williams',
    toUser: 'Miller',
    status: 'in_route',
  },
  {
    id: 4,
    orderNumber: '#123325632',
    trackingNumber: '#123183132',
    from: 'Islamabad, Pakistan',
    to: 'Multan, Pakistan',
    fromUser: 'Daniel',
    toUser: 'Christopher',
    status: 'in_process',
  },
  {
    id: 5,
    orderNumber: '#123325632',
    trackingNumber: '#123183132',
    from: 'Los Angles, USA',
    to: 'Islamabad, Pakistan',
    fromUser: 'Joseph',
    toUser: 'Rodriguez',
    status: 'cancelled',
  },
];

export const OrderTableHeadData = [
  { id: 'orderNumber', label: 'Shipment #' },
  { id: 'source', label: 'Source' },
  { id: 'destination', label: 'Destination' },
  { id: 'customer', label: 'Customer' },
  { id: 'status', label: 'Status' },
  { id: 'view', label: '' },
  { id: 'action', label: '' },
];

export const ORDER_ADDRESS = [
  {
    label: '',
    value: 'Micheal Smith 534 fly drive Washington, NY 33021, United States',
  },
];

export const customerDetails = (order) => [
  {
    label: 'Name',
    value: order?.sender_name,
  },
  {
    label: 'Email',
    value: order?.sender_email || 'N/A',
  },
  {
    label: 'Phone',
    value: order?.sender_phone,
  },
  {
    label: 'Adress',
    value: `${order?.sender_city?.name}, ${order?.sender_city?.state?.name} - ${order?.sender_city?.state?.country?.name}`,
  },
];

export const shippingDetails = (order) => [
  {
    label: 'To',
    value: order?.receiver_name,
  },
  {
    label: 'Email',
    value: order?.receiver_email || 'N/A',
  },
  {
    label: 'Phone',
    value: order?.receiver_phone,
  },
  {
    label: 'Address',
    value: `${order?.receiver_address}, ${order?.receiver_city?.name}, ${order?.receiver_city?.state?.name} - ${order?.receiver_city?.state?.country?.name}`,
  },
];

const orderItemsInfo = (order) => {
  return order?.order_items?.flatMap((item) => [
    {
      label: 'Item Name',
      value: item?.name || 'N/A',
    },
    {
      label: 'Description',
      value: item?.description || 'N/A',
    },
    {
      label: 'Weight',
      value: `${item?.weight} ${order?.weight_type || ''}`,
    },
    {
      label: 'Quantity',
      value: item?.quantity,
    },
  ]);
};

export const shipmentDetails = (order) => [
  {
    label: 'Packaging',
    value: `${order?.package?.name} [${order?.package?.width} x ${order?.package?.height} x ${order?.package?.depth}] inch`,
  },
  ...(orderItemsInfo(order) || []),
  {
    label: 'Shipping Date',
    value: `${new Date(order?.shipping_date || new Date()).toLocaleString()}`,
  },
  {
    label: 'Collection Time',
    value: `${new Date(order?.collection_time || new Date()).toLocaleString()}`,
  },
];

export const orderPaymentDetails = (order) => [
  {
    label: 'Payment Type',
    value: order?.payment_type || 'N/A',
  },
  {
    label: 'Status',
    value: order?.payment_status || 'N/A',
  },
  {
    label: 'Date',
    value: `${new Date(order?.payment_date || new Date()).toLocaleString()}` || 'N/A',
  },
  {
    label: 'Discount',
    value: `$${order?.discount}` || 'N/A',
  },
  {
    label: 'Total Amount',
    value: `$${order?.total_amount}` || 'N/A',
  },
];

export const ORDER_DATA = [
  {
    label: 'Name',
    value: 'John Smith',
  },
  {
    label: 'Email',
    value: 'JohnSmith@gmail.com',
  },
  {
    label: 'Phone',
    value: '+555 5555 5555',
  },
  {
    label: 'Payment Type',
    value: 'Card Payment',
  },
];
export const ORDER_AMOUNT = [
  {
    label: 'Quantity',
    value: '3',
  },
  {
    label: 'Price',
    value: '100 * 3',
  },
  {
    label: 'Weight',
    value: '500g',
  },
  {
    label: 'Discount',
    value: '10%',
  },
  {
    label: 'Total Amount',
    value: '$300',
  },
];
