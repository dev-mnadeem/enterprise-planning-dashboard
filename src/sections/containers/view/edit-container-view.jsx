import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { ROUTES } from 'src/constants';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useMutation, useQuery } from 'src/api';
import toast from 'react-hot-toast';
import ContainerForm from 'src/components/orders/ContainerForm';

const EditContainerPage = ({ id }) => {
  const navigate = useNavigate();
  const containerEndPoint = `${ENDPOINTS.CONTAINERS}/${id}`;
  const { search } = useLocation();
  const viewOnly = new URLSearchParams(search).get('action') === 'view';
  const {
    data: container,
    loading: queryLoading,
    error: containerError,
  } = useQuery(containerEndPoint);
  const [mutate, { data: updatedContainer, loading, error }] = useMutation(containerEndPoint);

  useEffect(() => {
    if (updatedContainer) {
      toast.success('Container updated successfully!');
      navigate(ROUTES.CONTAINERS);
    }
  }, [updatedContainer]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (!container && containerError) {
      toast.error(containerError);
      navigate(ROUTES.CONTAINERS);
    }
  }, [container, containerError]);

  if (queryLoading || loading) return null;

  const onEditContainer = (values) => {
    mutate(
      {
        from_country_id: values?.from_country_id,
        to_country_id: values?.to_country_id,
        width: Number(values?.width || 0),
        height: Number(values?.height || 0),
        depth: Number(values?.depth || 0),
        volume: Number(values?.volume || 0),
      },
      'patch'
    );
  };

  const title = container?.tracking_number || 'Container';

  return (
    <Container>
      <Typography variant="h4">{viewOnly ? title : 'Edit Container'}</Typography>
      <ContainerForm
        initials={container}
        onSubmit={onEditContainer}
        viewOnly={viewOnly}
        buttonText={viewOnly ? 'Container Details' : 'Update Container'}
      />
    </Container>
  );
};

export default EditContainerPage;
