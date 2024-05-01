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

export default function LocationTableRow({
  id,
  name,
  city,
  status,
  address,
  country,
  selected,
  locationType,
  handleClick,
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(null);
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  const handleDelte = () => {
    dispatch(deleteLocation(id));
    handleCloseMenu();
  };

  const handleEdit = () => {
    handleCloseMenu();
    navigate(`/locations/${id}`);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>{country}</TableCell>
        <TableCell>{city}</TableCell>
        <TableCell align="center">
          <Label
            color={
              locationType === 'Warehouse'
                ? 'success'
                : locationType === 'Branch'
                ? 'error'
                : 'info'
            }
          >
            {locationType}
          </Label>
        </TableCell>
        <TableCell>{address}</TableCell>
        <TableCell>
          <Label color={status === ('banned' || 'Banned') ? 'error' : 'success'}>{status}</Label>
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
        <MenuItem onClick={handleDelte} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

LocationTableRow.propTypes = {
  country: PropTypes.any,
  handleClick: PropTypes.func,
  locationType: PropTypes.any,
  name: PropTypes.any,
  city: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
  address: PropTypes.string,
};
