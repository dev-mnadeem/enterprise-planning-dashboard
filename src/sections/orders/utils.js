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
  { id: 'orderNumber', label: 'Order Number' },
  { id: 'trackingNumber', label: 'Tracking Number' },
  { id: 'from', label: 'From Location' },
  { id: 'to', label: 'To Location' },
  { id: 'fromUser', label: 'From User' },
  { id: 'toUser', label: 'To User' },
  { id: 'status', label: 'Status' },
];


export const ORDER_ADDRESS = [{
  label:"",
  value: "Micheal Smith 534 fly drive Washington, NY 33021, United States"

}];


export const ORDER_DATA =[
  {
  label:"Name",
  value: "John Smith",
},
  {
  label:"Email",
  value: "JohnSmith@gmail.com",
},
  {
  label:"Phone",
  value: "+555 5555 5555",
},
  {
  label:"Payment Type",
  value: "Card Payment",
},
];
export const ORDER_AMOUNT =[
  {
  label:"Quantity",
  value: "3",
},
{
  label:"Price",
  value: "100 * 3",
},
{
  label:"Weight",
  value: "500g",
},
  {
  label:"Discount",
  value: "10%",
},
  {
  label:"Total Amount",
  value: "$300",
},
];