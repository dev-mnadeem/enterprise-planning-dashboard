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
import { Link, useNavigate } from 'react-router-dom';
import { PERMISSION_TYPE, ROUTES } from 'src/constants';
import { checkCurrentUserPermission } from 'src/utils';

export default function RolesTableRow({ id, index, name, onDeleteRole }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(null);
  const { user } = useAppSelector((state) => state.userReducer);
  const { DELETE, UPDATE } = PERMISSION_TYPE;

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  const handleDelete = (roleName) => {
    if (!id) return;

    handleCloseMenu();
    const confirmed = window.confirm(`Are you sure to Delete "${roleName}" Role?`);
    if (confirmed) {
      onDeleteRole(id);
    }
  };

  const handleEdit = () => {
    handleCloseMenu();
    navigate(`${ROUTES.USER_ROLES}/${id}`);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>{++index}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>
          <Link to={`${ROUTES.USER_ROLES}/${id}?action=view`}>View Permissions</Link>
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
        {checkCurrentUserPermission(user?.permissions, 'UserRole', UPDATE) && (
          <MenuItem onClick={handleEdit}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </MenuItem>
        )}

        {checkCurrentUserPermission(user?.permissions, 'UserRole', DELETE) && (
          <MenuItem onClick={() => handleDelete(name)} sx={{ color: 'error.main' }}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        )}
      </Popover>
    </>
  );
}
