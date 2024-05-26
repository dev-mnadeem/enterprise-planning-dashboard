import React, { useState } from 'react';
import { TableHeadData } from '../utils';
import Iconify from 'src/components/iconify';
import { useNavigate } from 'react-router-dom';
import Scrollbar from 'src/components/scrollbar';
import { useAppSelector } from 'src/state/hooks';
import LocationTableRow from '../location-table-row';
import LocationTableHead from '../location-table-head';
import LocationTableToolbar from '../location-table-toolbar';
import { TableEmptyRows, TableNoData } from 'src/components/common';
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
import { ENDPOINTS } from 'src/api/Endpoints';
import { useMutation, useQuery } from 'src/api';

const LocationPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [deleteLocationMutate, { loading: deleteLoading }] = useMutation(ENDPOINTS.LOCATIONS);
  const [selectedLocationType, setSelectedLocationType] = useState('');
  const {
    error,
    loading,
    data: locations,
    refetch: refetchlocations,
  } = useQuery(ENDPOINTS.LOCATIONS);

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
    inputData: locations,
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

  const notFound = !dataFiltered?.length && !!filterName;

  const handleLocationTypeChange = (event) => {
    setSelectedLocationType(event.target.value);
  };
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const deleteLocation = async (locationId) => {
    if (!locationId) return;

    const res = await deleteLocationMutate({}, 'DELETE', locationId);
    if (res) {
      refetchlocations();
    }
  };

  if (loading || deleteLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Locations</Typography>
        <Button
          onClick={() => navigate('/locations/add')}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          New Location
        </Button>
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
              <LocationTableHead
                order={order}
                orderBy={orderBy}
                headLabel={TableHeadData}
                onRequestSort={handleSort}
                rowCount={locations?.length}
                selectedCity={selectedCity}
                numSelected={0}
                selectedStatus={selectedStatus}
                onCityChange={handleCityChange}
                onStatusChange={handleStatusChange}
                selectedLocationType={selectedLocationType}
                onLocationTypeChange={handleLocationTypeChange}
              />
              <TableBody>
                {dataFiltered
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <LocationTableRow
                      id={row.id}
                      key={row.id}
                      name={row.name}
                      city={row.city_id}
                      status={row.status}
                      country={row.country}
                      address={row.address}
                      locationType={row.location_type_id}
                      onDeleteLocation={deleteLocation}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, locations?.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          page={page}
          component="div"
          count={locations?.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
};

export default LocationPage;
