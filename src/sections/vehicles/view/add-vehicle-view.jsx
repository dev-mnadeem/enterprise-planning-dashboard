import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { ROUTES } from 'src/constants';
import { useMutation } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';
import toast from 'react-hot-toast';
import VehicleForm from 'src/components/orders/VehicleForm';

const AddVehiclePage = () => {
  const navigation = useNavigate();
  const [createVehicle, { data, loading, error }] = useMutation(ENDPOINTS.VEHICLES);

  useEffect(() => {
    if (data) {
      toast.success('Vehicle added successfully!');
      navigation(ROUTES.VEHICLES);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error || 'Something went wrong!');
    }
  }, [error]);

  const onAddVehicle = (values) => {
    createVehicle({
      name: values?.name,
      model: values?.model,
      registration_number: values?.registration_number,
      driver_id: values?.driver_id,
      vehicle_type_id: values?.vehicle_type_id,
      status: values?.status,
    });
  };

  if (loading) return;

  return (
    <Container>
      <Typography variant="h4">Add new Vehicle</Typography>
      <VehicleForm onSubmit={onAddVehicle} buttonText="Add Vehicle" />
    </Container>
  );
};

export default AddVehiclePage;
