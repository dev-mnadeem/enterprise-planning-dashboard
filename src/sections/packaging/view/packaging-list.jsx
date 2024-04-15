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
import PackagingsTableRow from '../packagings-table-row';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useMutation, useQuery } from 'src/api';
import { PERMISSION_ENTITIES, PERMISSION_TYPE, ROUTES } from 'src/constants';
import { useAppSelector } from 'src/state/hooks';
import { checkCurrentUserPermission } from 'src/utils';
import toast from 'react-hot-toast';

const PackagingListPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const {
    data: packagings,
    loading,
    error,
    refetch: refetchPackagings,
  } = useQuery(ENDPOINTS.PACKAGINGS);
  const [deletePackagingMutate, { error: deletePackagingError }] = useMutation(
    ENDPOINTS.PACKAGINGS
  );
  const { user } = useAppSelector((state) => state.userReducer);
  const { ADD } = PERMISSION_TYPE;
  const { ORDER } = PERMISSION_ENTITIES;

  if (loading) return <div>Loading...</div>;
  if (error) {
    toast.error(error || 'Something went wrong!');
    return <div>Something went wrong!</div>;
  }
  if (deletePackagingError) toast.error(deletePackagingError || 'Something went wrong!');

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
    inputData: packagings,
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

  const deletePackaging = async (packageId) => {
    if (!packageId) return;

    const res = await deletePackagingMutate({}, 'DELETE', packageId);
    if (res) {
      toast.success('Packaging deleted successfully!');
      refetchPackagings();
    }
  };

  const notFound = !dataFiltered?.length && !!filterName;
  console.log('🚀 ~ PackagingListPage ~ dataFiltered:', dataFiltered);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h5">Manage Shipment Packaging</Typography>

        {checkCurrentUserPermission(user?.permissions, ORDER, ADD, user?.user_role?.name) && (
          <Button
            onClick={() => navigate(ROUTES.ADD_PACKAGING)}
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Packaging
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
                rowCount={packagings?.length}
              />
              <TableBody>
                {dataFiltered
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <PackagingsTableRow
                      id={row.id}
                      key={row.id}
                      name={row.name}
                      weight_limit={row.weight_limit}
                      weight_type={row.weight_type}
                      width={row.width}
                      height={row.height}
                      depth={row.depth}
                      onDeletePackaging={(packagingId) => deletePackaging(packagingId)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, packagings?.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          page={page}
          component="div"
          count={packagings?.length || 0}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
};

export default PackagingListPage;
