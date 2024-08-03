import React, { useEffect, useState } from 'react';
import { TableHeadData } from '../utils';
import Iconify from 'src/components/iconify';
import { useNavigate } from 'react-router-dom';
import Scrollbar from 'src/components/scrollbar';
import { applyFilter, emptyRows, getComparator } from 'src/utils/table';
import {
  Card,
  Stack,
  Table,
  Button,
  TableBody,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import {
  TableEmptyRows,
  TableNoData,
  TableSearchHead,
  TableSortToolbar,
} from 'src/components/common';
import PricingTableRow from '../pricing-table-row';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useMutation, useQuery } from 'src/api';
import { PERMISSION_ENTITIES, PERMISSION_TYPE, ROUTES } from 'src/constants';
import { useAppSelector } from 'src/state/hooks';
import { checkCurrentUserPermission } from 'src/utils';
import toast from 'react-hot-toast';

const PricingListPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data: pricings, loading, error, refetch: refetchPricings } = useQuery(ENDPOINTS.PRICING);
  const [deletePricingMutate, { error: deletePricingError }] = useMutation(ENDPOINTS.PRICING);
  const { user } = useAppSelector((state) => state.userReducer);
  const { ADD } = PERMISSION_TYPE;
  const { PRICING } = PERMISSION_ENTITIES;

  if (loading) return <div>Loading...</div>;
  if (error) {
    toast.error(error || 'Something went wrong!');
    return <div>Something went wrong!</div>;
  }
  if (deletePricingError) toast.error(deletePricingError || 'Something went wrong!');

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
    inputData: pricings,
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

  const deletePricing = async (pricingId) => {
    if (!pricingId) return;

    const res = await deletePricingMutate({}, 'DELETE', pricingId);
    if (res) {
      toast.success('Pricing deleted successfully!');
      refetchPricings();
    }
  };

  const notFound = !dataFiltered?.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h5">Manage Shipment Pricings</Typography>

        {checkCurrentUserPermission(user?.permissions, PRICING, ADD, user?.user_role?.name) && (
          <Button
            onClick={() => navigate(ROUTES.ADD_PRICING)}
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Price
          </Button>
        )}
      </Stack>
      <Card>
        <TableSortToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableSearchHead
                order={order}
                orderBy={orderBy}
                headLabel={TableHeadData}
                onRequestSort={handleSort}
                rowCount={pricings?.length}
              />
              <TableBody>
                {dataFiltered
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <PricingTableRow
                      id={row.id}
                      key={row.id}
                      fromCity={row.from_city}
                      toCity={row.to_city}
                      price={row.price}
                      updatedAt={row.updated_at}
                      shipmentRoute={row.route}
                      onDeletePricing={(pricingId) => deletePricing(pricingId)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, pricings?.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          page={page}
          component="div"
          count={pricings?.length || 0}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
};

export default PricingListPage;
