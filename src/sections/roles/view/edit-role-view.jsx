import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { useAppDispatch } from 'src/state/hooks';
import { ROUTES } from 'src/constants';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useMutation, useQuery } from 'src/api';
import toast from 'react-hot-toast';
import UserRoleForm from 'src/components/users/UserRoleForm';

const EditRolePage = ({ id }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const viewOnly = new URLSearchParams(search).get('action') === 'view';
  const userRolePoint = `${ENDPOINTS.USER_ROLES}/${id}`;
  const { data: role, loading: queryLoading, error: queryError } = useQuery(userRolePoint);
  const [mutate, { data: updatedUserRole, loading, error }] = useMutation(userRolePoint);

  if (queryLoading) return;
  if (!role) navigate(ROUTES.USERS);

  const onEditUserRole = (values) => {
    mutate(
      {
        name: values.name,
        permissions: values.permissions,
      },
      'patch'
    );
  };

  if (loading) return;
  if (error) return <>Error</>;
  if (updatedUserRole) {
    toast.success('Role updated successfully');
    navigate(ROUTES.USER_ROLES);
  }

  return (
    <Container>
      <Typography variant="h4">{viewOnly ? role?.name : 'Edit User Role'}</Typography>
      <UserRoleForm
        initials={role}
        viewOnly={viewOnly}
        onSubmit={onEditUserRole}
        buttonText="Update User Role"
      />
    </Container>
  );
};

export default EditRolePage;
