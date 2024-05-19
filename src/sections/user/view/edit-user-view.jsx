import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import LocationForm from 'src/components/location-form';
import { useAppDispatch, useAppSelector } from 'src/state/hooks';
import { updateLocation } from 'src/state/reducers/locationReducer';
import { ROUTES } from 'src/constants';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useMutation, useQuery } from 'src/api';
import UserForm from 'src/components/users/userForm';
import { method } from 'lodash';

const EditUserPage = ({ id }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userEndPoint = `${ENDPOINTS.USERS}/${id}`;
  const { data: user, loading: queryLoading, error: queryError } = useQuery(userEndPoint);
  const [mutate, { data: updatedUser, loading, error }] = useMutation(userEndPoint);

  if (queryLoading) return;
  if (!user) navigate(ROUTES.USERS);

  const onEditUser = (values) => {
    mutate(
      {
        username: values.username,
        email: values.email,
        role_id: values.userRole,
      },
      'patch'
    );
  };

  if (loading) return;
  if (error) return <>{error}</>;
  if (updatedUser) {
    navigate(ROUTES.USERS);
  }

  return (
    <Container>
      <Typography variant="h4">Update Location</Typography>
      <UserForm initials={user} onSubmit={onEditUser} buttonText="Update User" />
    </Container>
  );
};

export default EditUserPage;
