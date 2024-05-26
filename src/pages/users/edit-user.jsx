import { useParams } from 'react-router-dom';
import { EditUserView } from 'src/sections/user/view';

function EditUserPage() {
  const params = useParams();
  return (
    <>
      <EditUserView id={params?.id} />
    </>
  );
}

export default EditUserPage;
