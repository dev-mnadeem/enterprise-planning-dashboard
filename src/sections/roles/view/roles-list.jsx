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
import { ENDPOINTS } from 'src/api/Endpoints';
import { useMutation, useQuery } from 'src/api';
import { PERMISSION_TYPE, ROUTES } from 'src/constants';
import RolesTableRow from '../roles-table-row';
import { checkCurrentUserPermission } from 'src/utils';
import { useAppSelector } from 'src/state/hooks';

const RolesListPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { user } = useAppSelector((state) => state.userReducer);
  const { data: userRoles, loading, error, refetch: refetchRoles } = useQuery(ENDPOINTS.USER_ROLES);
  const [deleteUserRoleMutate, { data: deletedRole }] = useMutation(ENDPOINTS.USER_ROLES);
  const { ADD } = PERMISSION_TYPE;

  if (loading) return;
  if (error) return <div>Error</div>;

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
    inputData: userRoles,
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

  const deleteRole = async (userRoleId) => {
    if (!userRoleId) return;

    const res = await deleteUserRoleMutate({}, 'DELETE', userRoleId);
    if (res) {
      refetchRoles();
    }
  };

  const notFound = !dataFiltered?.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Manage System Roles</Typography>

        {checkCurrentUserPermission(user?.permissions, 'UserRole', ADD) && (
          <Button
            onClick={() => navigate(ROUTES.ADD_USER_ROLE)}
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Role
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
                rowCount={userRoles?.length}
              />
              <TableBody>
                {dataFiltered
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <RolesTableRow
                      id={row.id}
                      key={row.id}
                      index={index}
                      name={row.name}
                      onDeleteRole={(userRoleId) => deleteRole(userRoleId)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, userRoles?.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          page={page}
          component="div"
          count={userRoles?.length || 0}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
};

export default RolesListPage;
