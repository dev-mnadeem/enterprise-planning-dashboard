import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { ROUTES } from 'src/constants';
import { useMutation } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';
import toast from 'react-hot-toast';
import PricingForm from 'src/components/orders/PricingForm';

const AddPricingPage = () => {
  const navigation = useNavigate();
  const [createPricing, { data, loading, error }] = useMutation(ENDPOINTS.PRICING);

  useEffect(() => {
    if (data) {
      toast.success('Pricing added successfully!');
      navigation(ROUTES.PRICING);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error || 'Something went wrong!');
    }
  }, [error]);

  const onAddPricing = (values) => {
    createPricing({
      from_city_id: values?.from_city_id,
      to_city_id: values?.to_city_id,
      price: values?.price,
    });
  };

  if (loading) return;

  return (
    <Container>
      <Typography variant="h4">Add new Pricing</Typography>
      <PricingForm onSubmit={onAddPricing} buttonText="Add Pricing" />
    </Container>
  );
};

export default AddPricingPage;
