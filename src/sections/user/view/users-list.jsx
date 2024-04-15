import { useEffect, useState } from 'react';
import { TableHeadData } from '../utils';
import Iconify from 'src/components/iconify';
import { useNavigate } from 'react-router-dom';
import Scrollbar from 'src/components/scrollbar';
import { ListError, ListLoading, TableEmptyState } from 'src/components/list-state';
import { applyFilter, getComparator } from 'src/utils/table';
import { useDebouncedValue } from 'src/hooks/use-debounced-value';
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
import { TableNoData, TableSearchHead, TableSortToolbar } from 'src/components/common';
import UsersTableRow from '../users-table-row';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useMutation, usePagedQuery } from 'src/api';
import { PERMISSION_ENTITIES, PERMISSION_TYPE, ROUTES } from 'src/constants';
import { useAppSelector } from 'src/state/hooks';
import { checkCurrentUserPermission } from 'src/utils';
import toast from 'react-hot-toast';

const UsersListPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const search = useDebouncedValue(filterName.trim());
  const {
    rows: users,
    total,
    initialLoading,
    error,
    refetch: refetchUsers,
  } = usePagedQuery(ENDPOINTS.USERS, { page, rowsPerPage, search });
  const [deleteUserMutate, { error: deleteUserError }] = useMutation(ENDPOINTS.USERS);
  const { user } = useAppSelector((state) => state.userReducer);
  const { ADD } = PERMISSION_TYPE;
  const { USER } = PERMISSION_ENTITIES;

  // Toasting during render fired again on every re-render; fire once per new error.
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (deleteUserError) toast.error(deleteUserError);
  }, [deleteUserError]);

  if (initialLoading) return <ListLoading label="users" />;
  if (error) return <ListError label="users" message={error} onRetry={refetchUsers} />;

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

  // The API filters and pages; sorting applies to the page on screen.
  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const deleteUser = async (userId) => {
    if (!userId) return;

    const res = await deleteUserMutate({}, 'DELETE', userId);
    if (res) {
      toast.success('User deleted successfully!');
      refetchUsers();
    }
  };

  const notFound = !dataFiltered?.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Manage System Users</Typography>

        {checkCurrentUserPermission(user?.permissions, USER, ADD) && (
          <Button
            onClick={() => navigate(ROUTES.ADD_USER)}
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New User
          </Button>
        )}
      </Stack>
      <Card>
        <TableSortToolbar filterName={filterName} onFilterName={handleFilterByName} />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableSearchHead
                order={order}
                orderBy={orderBy}
                headLabel={TableHeadData}
                onRequestSort={handleSort}
                rowCount={users?.length}
              />
              <TableBody>
                {dataFiltered?.map((row) => (
                  <UsersTableRow
                    id={row.id}
                    key={row.id}
                    username={row.name}
                    user_role={row.user_role}
                    email={row.email}
                    mobile_number={row.phone_number}
                    status={row.status}
                    onDeleteUser={(userId) => deleteUser(userId)}
                  />
                ))}

                {notFound && <TableNoData query={filterName} />}

                {!dataFiltered?.length && !filterName && (
                  <TableEmptyState
                    title="No users yet"
                    hint="Invite staff and assign them a role."
                  />
                )}
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
};

export default UsersListPage;
