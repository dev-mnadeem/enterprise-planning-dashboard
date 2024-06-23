import { useParams } from 'react-router-dom';
import { OrderDetailView } from 'src/sections/orders/view';

const OrderDetailPage = () => {
  const params = useParams();

  return (
    <>
      <OrderDetailView id={params?.id} />
    </>
  );
};

export default OrderDetailPage;
