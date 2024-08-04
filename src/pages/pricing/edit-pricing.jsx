import { useParams } from 'react-router-dom';
import { EditPricingView } from 'src/sections/pricing/view';

function EditPricingPage() {
  const params = useParams();
  return (
    <>
      <EditPricingView id={params?.id} />
    </>
  );
}

export default EditPricingPage;
