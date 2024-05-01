import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { EditLocationView } from 'src/sections/locations/view';

function EditLocationPage() {
  const params = useParams();
  return (
    <>
      <Helmet>
        <title> Add Location | Adinkra UI </title>
      </Helmet>

      <EditLocationView id={params?.id} />
    </>
  );
}

export default EditLocationPage;
