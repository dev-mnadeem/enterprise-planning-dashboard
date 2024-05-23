import { useParams } from 'react-router-dom';
import { EditRoleView } from 'src/sections/roles/view';

function EditUserRolePage() {
  const params = useParams();
  return (
    <>
      <EditRoleView id={params?.id} />
    </>
  );
}

export default EditUserRolePage;
