import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import LocationForm from 'src/components/location-form';
import { useAppDispatch, useAppSelector } from 'src/state/hooks';
import { updateLocation } from 'src/state/reducers/locationReducer';
import { ROUTES } from 'src/constants';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useMutation, useQuery } from 'src/api';
import UserForm from 'src/components/users/userForm';
import { method } from 'lodash';
import toast from 'react-hot-toast';

const EditUserPage = ({ id }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userEndPoint = `${ENDPOINTS.USERS}/${id}`;
  const { search } = useLocation();
  const viewOnly = new URLSearchParams(search).get('action') === 'view';
  const { data: user, loading: queryLoading, error: userError } = useQuery(userEndPoint);
  const [mutate, { data: updatedUser, loading, error }] = useMutation(userEndPoint);

  useEffect(() => {
    if (updatedUser) {
      toast.success('User added successfully!');
      navigate(ROUTES.USERS);
    }
  }, [updatedUser]);

  useEffect(() => {
    if (error) {
      toast.error(error || 'Something went wrong!');
      navigate(ROUTES.USERS);
    }
  }, [error]);

  useEffect(() => {
    if (!user && userError) {
      toast.error(userError || 'Something went wrong!');
      navigate(ROUTES.USERS);
    }
  }, [user, queryLoading]);

  if (queryLoading) return;

  const onEditUser = (values) => {
    mutate(
      {
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
        location_ids: values?.location_ids,
      },
      'patch'
    );
  };

  if (loading) return;

  return (
    <Container>
      <Typography variant="h4">{viewOnly ? user?.name : 'Edit User Role'}</Typography>
      <UserForm
        initials={user}
        onSubmit={onEditUser}
        viewOnly={viewOnly}
        buttonText={viewOnly ? 'User Details' : 'Update User'}
      />
    </Container>
  );
};

export default EditUserPage;
