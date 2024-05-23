import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'src/state/hooks';
import UserForm from 'src/components/users/userForm';
import { ROUTES } from 'src/constants';
import { useMutation } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';
import toast from 'react-hot-toast';

const AddUserPage = () => {
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

  const onAddUser = (values) => {
    mutate({
      name: values?.name,
      email: values?.email,
      role_id: values?.userRole,
      branch: values?.branch,
      phone_number: values?.phone_number,
      status: values?.status,
      city_id: values?.city,
      address: values?.address,
      geo_location: '',
      permissions: values?.permissions,
    });
  };

  if (loading) return;

  return (
    <Container>
      <Typography variant="h4">Add new User</Typography>
      <UserForm onSubmit={onAddUser} buttonText="Add User" />
    </Container>
  );
};

export default AddUserPage;
