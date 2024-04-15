import { useEffect, useState } from 'react';
import { applyFilter, getComparator } from 'src/utils';
import { useDebouncedValue } from 'src/hooks/use-debounced-value';
import { OrderTableHeadData } from '../utils';
import {
  Button,
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
import toast from 'react-hot-toast';
import Scrollbar from 'src/components/scrollbar';
import LocationTableToolbar from 'src/sections/locations/location-table-toolbar';
import OrderTableRow from '../order-table-row';
import TableHeader from 'src/components/table-header';
import Iconify from 'src/components/iconify';
import { ROUTES } from 'src/constants';
import { useNavigate } from 'react-router-dom';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useMutation, usePagedQuery } from 'src/api';
import { TableNoData } from 'src/components/common';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const search = useDebouncedValue(filterName.trim());
  const {
    rows: orders,
    total,
    initialLoading,
    error,
    refetch: refetchOrders,
  } = usePagedQuery(ENDPOINTS.ORDERS, { page, rowsPerPage, search });
  const [cancelOrderMutate, { error: cancelOrderError }] = useMutation(ENDPOINTS.ORDERS);

  // Toasting during render fired again on every re-render; fire once per new error.
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (cancelOrderError) toast.error(cancelOrderError);
  }, [cancelOrderError]);

  if (initialLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong!</div>;

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  // The API searches order numbers and pages; sorting applies to the page on screen.
  const dataFiltered = applyFilter({
    inputData: orders,
    comparator: getComparator(order, orderBy),
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const cancelOrder = async (orderId) => {
    if (!orderId) return;

    const res = await cancelOrderMutate({}, 'DELETE', orderId);
    if (res) {
      toast.success('Order canceled successfully!');
      refetchOrders();
    }
  };

  const notFound = !dataFiltered?.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Shipments</Typography>
        <Button
          onClick={() => navigate(ROUTES.ADD_ORDER)}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Create New Shipment
        </Button>
      </Stack>
      <Card>
        <LocationTableToolbar
          numSelected={0}
          placeholder="Search Shipment..."
          filterName={filterName}
          onFilterName={handleFilterByName}
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 860 }}>
              <TableHeader
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSort}
                headLabel={OrderTableHeadData}
              />
              <TableBody>
                {dataFiltered?.map((row) => (
                  <OrderTableRow
                    id={row?.id}
                    key={row.id}
                    source={row?.sender_city?.name}
                    destination={row?.receiver_city?.name}
                    customer={row.sender_name}
                    history={row?.history?.[0]}
                    orderNumber={row?.order_number}
                    onCancelOrder={(orderId) => cancelOrder(orderId)}
                  />
                ))}

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          page={page}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
