import { useParams } from 'react-router-dom';
import { EditVehicleView } from 'src/sections/vehicles/view';

function EditVehiclePage() {
  const params = useParams();
  return (
    <>
      <EditVehicleView id={params?.id} />
    </>
  );
}

export default EditVehiclePage;
