import toast from 'react-hot-toast';
import { useMutation } from 'src/api';
import { ROUTES } from 'src/constants';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import LocationForm from 'src/components/location-form';

const AddLocationPage = () => {
  const navigation = useNavigate();
  const [addLocation, { data, loading, error }] = useMutation(ENDPOINTS.LOCATIONS);

  useEffect(() => {
    if (data) {
      toast.success('Location added successfully!');
      navigation(ROUTES.LOCATIONS);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error || 'Something went wrong!');
      navigation(ROUTES.USERS);
    }
  }, [error]);

  const onAddLocation = async (values) => {
    await addLocation({
      name: values.name,
      description: 'test',
      city_id: values.city,
      address: values.address,
      geo_location: values.geoLocation,
      location_type_id: values.locationType,
      status: values.status === 'active' ? true : false,
    });
  };

  if (loading) return;
  return (
    <Container>
      <Typography variant="h4">Add new Location</Typography>
      <LocationForm onSubmit={onAddLocation} buttonText="Add Location" />
    </Container>
  );
};

export default AddLocationPage;
