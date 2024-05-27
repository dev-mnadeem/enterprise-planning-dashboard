import { useState } from 'react';
import { applyFilter, getComparator } from 'src/utils';
import { OrderTableHeadData, orders } from '../utils';
import {
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
import Scrollbar from 'src/components/scrollbar';
import TableHeader from 'src/components/table-header/inde';
import LocationTableToolbar from 'src/sections/locations/location-table-toolbar';
import OrderTableRow from '../order-table-row';

export default function OrdersPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const dataFiltered = applyFilter({
    fieldToSearch: 'name',
    inputData: orders,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const notFound = !orders?.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Orders</Typography>
        {/* <Button
          onClick={() => navigate('/locations/add')}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          New Order
        </Button> */}
      </Stack>
      <Card>
        <LocationTableToolbar
          numSelected={0}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHeader
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSort}
                headLabel={OrderTableHeadData}
              />
              <TableBody>
                {dataFiltered
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <OrderTableRow
                      id={row.id}
                      to={row.to}
                      from={row.from}
                      toUser={row.toUser}
                      status={row.status}
                      fromUser={row.fromUser}
                      orderNumber={row.orderNumber}
                      trackingNumber={row.trackingNumber}
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
    </Container>
  );
}
