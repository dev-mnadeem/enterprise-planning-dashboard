import { Helmet } from 'react-helmet-async';
import { AddLocationView } from 'src/sections/locations/view';

const AddLocationPage = () => (
  <>
    <Helmet>
      <title> Add Location | Adinkra UI </title>
    </Helmet>

    <AddLocationView />
  </>
);

export default AddLocationPage;
