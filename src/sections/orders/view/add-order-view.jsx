import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { ROUTES } from 'src/constants';
import { useMutation } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';
import toast from 'react-hot-toast';
import OrderForm from 'src/components/orders/OrderForm';

const AddOrderPage = () => {
  const navigation = useNavigate();
  const [createOrder, { data, loading, error }] = useMutation(ENDPOINTS.ORDERS);

  useEffect(() => {
    if (data) {
      toast.success('Shipment created successfully!');
      navigation(ROUTES.ORDERS);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error || 'Something went wrong!');
    }
  }, [error]);

  const onAddOrder = async (values) => {
    await createOrder({ ...values });
  };

  return (
    <Container>
      <Typography variant="h4">Add new Shipment</Typography>
      <OrderForm onSubmit={onAddOrder} buttonText="Create Shipment" />
    </Container>
  );
};

export default AddOrderPage;
