import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import LocationForm from 'src/components/location-form';
import { useAppDispatch, useAppSelector } from 'src/state/hooks';
import { addLocation } from 'src/state/reducers/locationReducer';

const AddLocationPage = () => {
  const navigation = useNavigate();
  const dispatch = useAppDispatch();
  const { locations } = useAppSelector((state) => state.locationReducer);

  const onAddLocation = (values) => {
    dispatch(
      addLocation({
        id: locations?.length ? locations[locations?.length - 1].id + 1 : 1,
        ...values,
      })
    );
    navigation('/locations');
  };
  return (
    <Container>
      <Typography variant="h4">Add new Location</Typography>
      <LocationForm onSubmit={onAddLocation} buttonText="Add Location" />
    </Container>
  );
};

export default AddLocationPage;
