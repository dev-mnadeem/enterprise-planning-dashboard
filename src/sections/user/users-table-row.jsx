import { useState } from 'react';
import PropTypes from 'prop-types';
import Label from 'src/components/label';
import Popover from '@mui/material/Popover';
import Iconify from 'src/components/iconify';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { useAppDispatch, useAppSelector } from 'src/state/hooks';
import { deleteLocation } from 'src/state/reducers/locationReducer';
import { useNavigate } from 'react-router-dom';
import { PERMISSION_ENTITIES, PERMISSION_TYPE, ROUTES } from 'src/constants';
import { checkCurrentUserPermission } from 'src/utils';

export default function UsersTableRow({
  id,
  username,
  user_role,
  email,
  status,
  mobile_number,
  onDeleteUser,
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(null);
  const { user } = useAppSelector((state) => state.userReducer);
  const { REMOVE, UPDATE, VIEW } = PERMISSION_TYPE;
  const { USER } = PERMISSION_ENTITIES;

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  const handleDelete = (username) => {
    if (!id) return;

    handleCloseMenu();
    const confirmed = window.confirm(`Are you sure to Delete "${username}" User?`);
    if (confirmed) {
      onDeleteUser(id);
    }
  };

  const handleView = () => {
    handleCloseMenu();
    navigate(`${ROUTES.USERS}/${id}?action=view`);
  };

  const handleEdit = () => {
    handleCloseMenu();
    navigate(`${ROUTES.USERS}/${id}`);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>{username}</TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{user_role?.name}</TableCell>
        <TableCell>{mobile_number || ' -- '}</TableCell>
        <TableCell>
          <Label color={!status ? 'error' : 'success'}>{status ? 'Active' : 'Inactive'}</Label>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        {checkCurrentUserPermission(user?.permissions, USER, VIEW) && (
          <MenuItem onClick={handleView}>
            <Iconify icon="eva:eye-outline" sx={{ mr: 2 }} />
            View
          </MenuItem>
        )}

        {checkCurrentUserPermission(user?.permissions, USER, UPDATE) && (
          <MenuItem onClick={handleEdit}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </MenuItem>
        )}

        {checkCurrentUserPermission(user?.permissions, USER, REMOVE) && (
          <MenuItem onClick={() => handleDelete(username)} sx={{ color: 'error.main' }}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        )}
      </Popover>
    </>
  );
}
