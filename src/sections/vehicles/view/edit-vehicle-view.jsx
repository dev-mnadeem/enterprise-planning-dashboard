import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { ROUTES } from 'src/constants';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useMutation, useQuery } from 'src/api';
import toast from 'react-hot-toast';
import VehicleForm from 'src/components/orders/VehicleForm';

const EditVehiclePage = ({ id }) => {
  const navigate = useNavigate();
  const vehicleEndPoint = `${ENDPOINTS.VEHICLES}/${id}`;
  const { search } = useLocation();
  const viewOnly = new URLSearchParams(search).get('action') === 'view';
  const { data: vehicle, loading: queryLoading, error: vehicleError } = useQuery(vehicleEndPoint);
  const [mutate, { data: updatedVehicle, loading, error }] = useMutation(vehicleEndPoint);

  useEffect(() => {
    if (updatedVehicle) {
      toast.success('Vehicle updated successfully!');
      navigate(ROUTES.VEHICLES);
    }
  }, [updatedVehicle]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (!vehicle && vehicleError) {
      toast.error(vehicleError);
      navigate(ROUTES.VEHICLES);
    }
  }, [vehicle, vehicleError]);

  if (queryLoading || loading) return null;

  const onEditVehicle = (values) => {
    mutate(
      {
        name: values?.name,
        model: values?.model,
        registration_number: values?.registration_number,
        driver_id: values?.driver_id || undefined,
        vehicle_type_id: values?.vehicle_type_id,
        status: values?.status,
      },
      'patch'
    );
  };

  return (
    <Container>
      <Typography variant="h4">{viewOnly ? vehicle?.name : 'Edit Vehicle'}</Typography>
      <VehicleForm
        initials={vehicle}
        onSubmit={onEditVehicle}
        viewOnly={viewOnly}
        buttonText={viewOnly ? 'Vehicle Details' : 'Update Vehicle'}
      />
    </Container>
  );
};

export default EditVehiclePage;
