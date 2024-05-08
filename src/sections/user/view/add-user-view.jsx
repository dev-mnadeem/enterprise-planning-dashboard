import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'src/state/hooks';
import UserForm from 'src/components/users/userForm';
import { ROUTES } from 'src/constants';
import { useMutation } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';

const AddUserPage = () => {
  const navigation = useNavigate();
  const dispatch = useAppDispatch();
  const [mutate, { data, loading, error }] = useMutation(ENDPOINTS.USERS);

  const onAddUser = (values) => {
    mutate({
      username: values.username,
      email: values.email,
      role_id: values.userRole,
    });
  };

  if (loading) return <>Loading...</>;
  if (error) return <>Error</>;
  if (data) {
    navigation(ROUTES.USERS);
  }

  return (
    <Container>
      <Typography variant="h4">Add new User</Typography>
      <UserForm onSubmit={onAddUser} buttonText="Add User" />
    </Container>
  );
};

export default AddUserPage;
