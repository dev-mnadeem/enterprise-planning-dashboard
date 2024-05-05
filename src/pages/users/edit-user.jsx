import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { EditLocationView } from 'src/sections/locations/view';
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
