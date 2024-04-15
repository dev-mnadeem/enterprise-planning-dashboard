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
import PackagingsTableRow from '../vehicles-table-row';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useMutation, useQuery } from 'src/api';
import { PERMISSION_ENTITIES, PERMISSION_TYPE, ROUTES } from 'src/constants';
import { useAppSelector } from 'src/state/hooks';
import { checkCurrentUserPermission } from 'src/utils';
import toast from 'react-hot-toast';

const VehiclesListPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data: vehicles, loading, error, refetch: refetchVehicles } = useQuery(ENDPOINTS.VEHICLES);
  const [deleteVehicleMutate, { error: deleteVehicleError }] = useMutation(ENDPOINTS.VEHICLES);
  const { user } = useAppSelector((state) => state.userReducer);
  const { ADD } = PERMISSION_TYPE;
  const { VEHICLE } = PERMISSION_ENTITIES;

  if (loading) return <div>Loading...</div>;
  if (error) {
    toast.error(error || 'Something went wrong!');
    return <div>Something went wrong!</div>;
  }
  if (deleteVehicleError) toast.error(deleteVehicleError || 'Something went wrong!');

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
    fieldToSearch: 'registration_number',
    inputData: vehicles,
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

  const deleteVehicle = async (vehicleId) => {
    if (!vehicleId) return;

    const res = await deleteVehicleMutate({}, 'DELETE', vehicleId);
    if (res) {
      toast.success('Vehicle deleted successfully!');
      refetchVehicles();
    }
  };

  const notFound = !dataFiltered?.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h5">Manage Vehicles</Typography>

        {checkCurrentUserPermission(user?.permissions, VEHICLE, ADD, user?.user_role?.name) && (
          <Button
            onClick={() => navigate(ROUTES.ADD_VEHICLE)}
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Vehicle
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
                rowCount={vehicles?.length}
              />
              <TableBody>
                {dataFiltered
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <PackagingsTableRow
                      id={row.id}
                      key={row.id}
                      name={row?.name}
                      registration_number={row?.registration_number}
                      driver={row?.driver?.name}
                      category={row?.vehicle_type?.name}
                      onDeleteVehicle={(vehicleId) => deleteVehicle(vehicleId)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, vehicles?.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          page={page}
          component="div"
          count={vehicles?.length || 0}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
};

export default VehiclesListPage;
