import { useParams } from 'react-router-dom';
import { EditUserView } from 'src/sections/user/view';

function EditShipmentPage() {
  const params = useParams();
  return (
    <>
      <EditUserView id={params?.id} />
    </>
  );
}

export default EditShipmentPage;
