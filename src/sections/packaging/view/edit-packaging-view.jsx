import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { ROUTES } from 'src/constants';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useMutation, useQuery } from 'src/api';
import toast from 'react-hot-toast';
import PackagingForm from 'src/components/orders/PackagingForm';

const EditPackagingPage = ({ id }) => {
  const navigate = useNavigate();
  const packagingEndPoint = `${ENDPOINTS.PACKAGINGS}/${id}`;
  const { search } = useLocation();
  const viewOnly = new URLSearchParams(search).get('action') === 'view';
  const {
    data: packaging,
    loading: queryLoading,
    error: packageError,
  } = useQuery(packagingEndPoint);
  const [mutate, { data: updatedPackage, loading, error }] = useMutation(packagingEndPoint);

  useEffect(() => {
    if (updatedPackage) {
      toast.success('Packaging added successfully!');
      navigate(ROUTES.PACKAGINGS);
    }
  }, [updatedPackage]);

  useEffect(() => {
    if (error) {
      toast.error(error || 'Something went wrong!');
      navigate(ROUTES.PACKAGINGS);
    }
  }, [error]);

  useEffect(() => {
    if (!packaging && packageError) {
      toast.error(packageError || 'Something went wrong!');
      navigate(ROUTES.PACKAGINGS);
    }
  }, [packaging, queryLoading]);

  if (queryLoading) return;

  const onEditPackaging = (values) => {
    mutate(
      {
        name: values?.name,
        depth: Number(values?.depth),
        width: Number(values?.width),
        height: Number(values?.height),
        price: Number(values?.price),
        weight_limit: Number(values?.weight_limit),
        weight_type: values?.weight_type || 'kg',
      },
      'patch'
    );
  };

  if (loading) return;

  return (
    <Container>
      <Typography variant="h4">{viewOnly ? packaging?.name : 'Edit Packaging'}</Typography>
      <PackagingForm
        initials={packaging}
        onSubmit={onEditPackaging}
        viewOnly={viewOnly}
        buttonText={viewOnly ? 'Packaging Details' : 'Update Packaging'}
      />
    </Container>
  );
};

export default EditPackagingPage;
