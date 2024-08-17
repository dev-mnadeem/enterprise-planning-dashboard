import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { ROUTES } from 'src/constants';
import { useMutation } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';
import toast from 'react-hot-toast';
import PackagingForm from 'src/components/orders/PackagingForm';

const AddPackagingPage = () => {
  const navigation = useNavigate();
  const [createPackaging, { data, loading, error }] = useMutation(ENDPOINTS.PACKAGINGS);

  useEffect(() => {
    if (data) {
      toast.success('Packaging added successfully!');
      navigation(ROUTES.PACKAGINGS);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error || 'Something went wrong!');
    }
  }, [error]);

  const onAddPackaging = (values) => {
    createPackaging({
      name: values?.name,
      depth: Number(values?.depth || 0),
      width: Number(values?.width || 0),
      height: Number(values?.height || 0),
      price: Number(values?.price || 0),
      weight_limit: values?.weight_limit || 0,
      weight_type: values?.weight_type || 'kg',
      route: values?.shipment_path || 'road',
    });
  };

  if (loading) return;

  return (
    <Container>
      <Typography variant="h4">Add new Packaging</Typography>
      <PackagingForm onSubmit={onAddPackaging} buttonText="Add Packaging" />
    </Container>
  );
};

export default AddPackagingPage;
