import React, { useEffect } from 'react';
import { useMutation, useQuery } from 'src/api';
import toast from 'react-hot-toast';
import { ROUTES } from 'src/constants';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import LocationForm from 'src/components/location-form';

const EditLocationPage = ({ id }) => {
  const navigation = useNavigate();
  const locationEndPoint = `${ENDPOINTS.LOCATIONS}/${id}`;
  const {
    data: location,
    loading: queryLoading,
    error: locationError,
  } = useQuery(locationEndPoint);
  const [mutate, { data: updatedLocation, loading, error }] = useMutation(locationEndPoint);

  useEffect(() => {
    if (updatedLocation) {
      toast.success('Location updated successfully!');
      navigation(ROUTES.LOCATIONS);
    }
  }, [updatedLocation]);

  useEffect(() => {
    if (error) {
      toast.error(error || 'Something went wrong!');
      navigation(ROUTES.LOCATIONS);
    }
  }, [error]);

  useEffect(() => {
    if (!location && locationError) {
      toast.error(locationError || 'Something went wrong!');
      navigate(ROUTES.LOCATIONS);
    }
  }, [location, queryLoading]);

  const onEditLocation = async (values) => {
    await mutate(
      {
        name: values.name,
        description: 'test',
        city_id: values.city,
        address: values.address,
        geo_location: values.geoLocation,
        location_type_id: values.locationType,
        status: values.status === 'active' ? true : false,
      },
      'patch'
    );
  };

  if (queryLoading || loading) return;
  return (
    <Container>
      <Typography variant="h4">Update Location</Typography>
      <LocationForm initials={location} onSubmit={onEditLocation} buttonText="Update Location" />
    </Container>
  );
};

export default EditLocationPage;
