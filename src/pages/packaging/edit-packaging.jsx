import { useParams } from 'react-router-dom';
import { EditPackagingView } from 'src/sections/packaging/view';

function EditPackagingPage() {
  const params = useParams();
  return (
    <>
      <EditPackagingView id={params?.id} />
    </>
  );
}

export default EditPackagingPage;
