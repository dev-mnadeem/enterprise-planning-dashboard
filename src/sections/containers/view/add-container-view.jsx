import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { ROUTES } from 'src/constants';
import { useMutation } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';
import toast from 'react-hot-toast';
import ContainerForm from 'src/components/orders/ContainerForm';

const AddContainerPage = () => {
  const navigation = useNavigate();
  const [createContainer, { data, loading, error }] = useMutation(ENDPOINTS.CONTAINERS);

  useEffect(() => {
    if (data) {
      toast.success('Container added successfully!');
      navigation(ROUTES.CONTAINERS);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error || 'Something went wrong!');
    }
  }, [error]);

  const onAddContainer = (values) => {
    createContainer({
      from_country_id: values?.from_country_id,
      to_country_id: values?.to_country_id,
      width: Number(values?.width || 0),
      height: Number(values?.height || 0),
      depth: Number(values?.depth || 0),
      volume: Number(values?.volume || 0),
    });
  };

  if (loading) return;

  return (
    <Container>
      <Typography variant="h4">Add new Container</Typography>
      <ContainerForm onSubmit={onAddContainer} buttonText="Add Container" />
    </Container>
  );
};

export default AddContainerPage;
