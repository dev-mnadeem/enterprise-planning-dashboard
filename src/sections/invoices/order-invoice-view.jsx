import React, { useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { useNavigate, useParams } from 'react-router-dom';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useQuery } from 'src/api';
import InvoiceDocument from 'src/components/orders/OrderInvoice';
import toast from 'react-hot-toast';
import { Button } from '@mui/material';
import { KeyboardBackspace } from '@mui/icons-material';
import { ROUTES } from 'src/constants';

const OrderInvoice = () => {
  const params = useParams();
  const navigate = useNavigate();
  const orderEndPoint = `${ENDPOINTS.ORDERS}/${params.id}`;
  const { data: order, loading: queryLoading, error: orderError } = useQuery(orderEndPoint);

  useEffect(() => {
    if (!order && orderError) {
      toast.error(orderError || 'Something went wrong!');
      navigate(ROUTES.ORDERS);
    }
  }, [order, queryLoading]);

  if (queryLoading) return;

  return (
    <div>
      <Button
        className="mb-3"
        startIcon={<KeyboardBackspace />}
        onClick={() => navigate(ROUTES.ORDERS)}
      >
        Back to Orders
      </Button>
      <PDFViewer style={{ width: '100%', height: '90vh' }}>
        <InvoiceDocument order={order} />
      </PDFViewer>
    </div>
  );
};

export default OrderInvoice;
