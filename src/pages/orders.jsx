import { Helmet } from 'react-helmet-async';
import { OrderView } from 'src/sections/orders/view';

const OrdersPage = () => (
  <>
    <Helmet>
      <title> Location | Adinkra UI </title>
    </Helmet>

    <OrderView />
  </>
);

export default OrdersPage;
