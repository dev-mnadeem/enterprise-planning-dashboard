import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { ROUTES } from 'src/constants';
import { useMutation } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';
import toast from 'react-hot-toast';
import ShipmentForm from 'src/components/shipment/form';

const AddShipmentPage = () => {
  const navigation = useNavigate();
  const [mutate, { data, loading, error }] = useMutation(ENDPOINTS.USERS);

  useEffect(() => {
    if (data) {
      toast.success('User added successfully!');
      navigation(ROUTES.USERS);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error || 'Something went wrong!');
      navigation(ROUTES.USERS);
    }
  }, [error]);

  const onAddShipment = (values) => {};

  if (loading) return;

  return (
    <Container>
      <Typography variant="h4">Add new Shipment</Typography>
      <ShipmentForm onSubmit={onAddShipment} buttonText="Create Shipment" />
    </Container>
  );
};

export default AddShipmentPage;
