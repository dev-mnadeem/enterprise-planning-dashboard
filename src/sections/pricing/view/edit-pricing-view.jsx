import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { ROUTES } from 'src/constants';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useMutation, useQuery } from 'src/api';
import toast from 'react-hot-toast';
import PackagingForm from 'src/components/orders/PackagingForm';
import PricingForm from 'src/components/orders/PricingForm';

const EditPricingPage = ({ id }) => {
  const navigate = useNavigate();
  const pricingEndPoint = `${ENDPOINTS.PRICING}/${id}`;
  const { search } = useLocation();
  const viewOnly = new URLSearchParams(search).get('action') === 'view';
  const { data: pricing, loading: queryLoading, error: pricingError } = useQuery(pricingEndPoint);
  const [mutate, { data: updatedPricing, loading, error }] = useMutation(pricingEndPoint);

  useEffect(() => {
    if (updatedPricing) {
      toast.success('Pricing updated successfully!');
      navigate(ROUTES.PRICING);
    }
  }, [updatedPricing]);

  useEffect(() => {
    if (error) {
      toast.error(error || 'Something went wrong!');
      navigate(ROUTES.PRICING);
    }
  }, [error]);

  useEffect(() => {
    if (!pricing && pricingError) {
      toast.error(pricingError || 'Something went wrong!');
      navigate(ROUTES.PRICING);
    }
  }, [pricing, queryLoading]);

  if (queryLoading) return;

  const onEditPricing = (values) => {
    mutate(
      {
        from_city_id: values?.from_city_id,
        to_city_id: values?.to_city_id,
        price: values?.price,
      },
      'patch'
    );
  };

  if (loading) return;

  return (
    <Container>
      <Typography variant="h4">{viewOnly ? pricing?.name : 'Edit Pricing'}</Typography>
      <PricingForm
        initials={pricing}
        onSubmit={onEditPricing}
        viewOnly={viewOnly}
        buttonText={viewOnly ? 'Pricing Details' : 'Update Pricing'}
      />
    </Container>
  );
};

export default EditPricingPage;
