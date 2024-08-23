import { useParams } from 'react-router-dom';
import { EditContainerView } from 'src/sections/containers/view';

function EditContainerPage() {
  const params = useParams();
  return (
    <>
      <EditContainerView id={params?.id} />
    </>
  );
}

export default EditContainerPage;
