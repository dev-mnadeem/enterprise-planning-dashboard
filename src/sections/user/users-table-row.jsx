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
import { useAppDispatch } from 'src/state/hooks';
import { deleteLocation } from 'src/state/reducers/locationReducer';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'src/constants';

export default function UsersTableRow({
  id,
  username,
  user_role,
  email,
  branch,
  mobile_number,
  onDeleteUser,
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(null);
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  const handleDelte = (username) => {
    if (!id) return;

    handleCloseMenu();
    const confirmed = window.confirm(`Are you sure to Delete "${username}" User?`);
    if (confirmed) {
      onDeleteUser(id);
    }
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
        <TableCell align="center">
          <Label>{branch}</Label>
        </TableCell>
        <TableCell>{mobile_number || ' -- '}</TableCell>
        <TableCell>
          <Label color={'status' === ('banned' || 'Banned') ? 'error' : 'success'}>
            {'status'}
          </Label>
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
        <MenuItem onClick={handleEdit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDelte(username)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
