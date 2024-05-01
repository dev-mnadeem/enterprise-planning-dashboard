import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import LocationForm from 'src/components/location-form';
import { useAppDispatch, useAppSelector } from 'src/state/hooks';
import { updateLocation } from 'src/state/reducers/locationReducer';

const EditLocationPage = ({ id }) => {
  const navigation = useNavigate();
  const dispatch = useAppDispatch();
  const { locations } = useAppSelector((state) => state.locationReducer);
  const location = locations?.find((loc) => loc.id === Number(id));

  const onEditLocation = (values) => {
    dispatch(
      updateLocation({
        id: Number(id),
        ...values,
      })
    );

    navigation('/locations');
  };
  return (
    <Container>
      <Typography variant="h4">Update Location</Typography>
      <LocationForm initials={location} onSubmit={onEditLocation} buttonText="Update Location" />
    </Container>
  );
};

export default EditLocationPage;
