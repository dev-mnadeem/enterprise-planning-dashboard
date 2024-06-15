export const ADD_ORDER_INITIALS = {
  sender_name: '',
  sender_email: '',
  sender_phone: '',
  sender_address: '',
  sender_city_id: '',
  receiver_name: '',
  receiver_email: '',
  receiver_phone: '',
  receiver_address: '',
  receiver_city_id: '',
  total_quantity: 0,
  sub_total: 0,
  discount: 0,
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
      price: 0,
      weight: '',
      weight_type: '',
      total_price: 0,
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
  { id: 'id', label: 'Id' },
  { id: 'orderNumber', label: 'Order #' },
  { id: 'trackingNumber', label: 'Tracking #' },
  { id: 'from', label: 'From Location' },
  { id: 'to', label: 'To Location' },
  { id: 'fromUser', label: 'From User' },
  { id: 'toUser', label: 'To User' },
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
