import { Helmet } from 'react-helmet-async';
import { OrderDetailView } from 'src/sections/orders/view';

const OrderDetailPage = () => (
  <>
    <Helmet>
      <title> Order Details | Adinkra UI </title>
    </Helmet>

    <OrderDetailView />
  </>
);

export default OrderDetailPage;
