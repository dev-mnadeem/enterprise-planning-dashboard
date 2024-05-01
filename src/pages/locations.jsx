import { Helmet } from 'react-helmet-async';
import { LocationView } from 'src/sections/locations/view';

const LocationPage = () => (
  <>
    <Helmet>
      <title> Location | Adinkra UI </title>
    </Helmet>

    <LocationView />
  </>
);

export default LocationPage;
