import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { ROUTES } from 'src/constants';
import { useMutation } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';
import UserRoleForm from 'src/components/users/UserRoleForm';
import toast from 'react-hot-toast';

const AddRolePage = () => {
  const navigation = useNavigate();
  const [createUserRole, { data, loading, error }] = useMutation(ENDPOINTS.USER_ROLES);

  const onAddRole = async (values) => {
    await createUserRole({
      name: values.name,
      permissions: values.permissions,
    });
  };

  if (loading) return;
  if (error) return <>Error</>;
  if (data) {
    toast.success('Role created successfully');
    navigation(ROUTES.USER_ROLES);
  }

  return (
    <Container>
      <Typography variant="h4">Add new User Role</Typography>
      <UserRoleForm onSubmit={onAddRole} buttonText="Create Role" />
    </Container>
  );
};

export default AddRolePage;
