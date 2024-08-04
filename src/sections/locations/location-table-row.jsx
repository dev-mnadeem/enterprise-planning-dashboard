import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Label from 'src/components/label';
import Popover from '@mui/material/Popover';
import Iconify from 'src/components/iconify';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';

export default function LocationTableRow({
  id,
  name,
  city,
  status,
  address,
  country,
  locationType,
  onDeleteLocation,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [fetchCity, { data: cityData }] = useLazyQuery(ENDPOINTS.CITIES);

  useEffect(() => {
    fetchCity({}, city);
  }, []);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  const handleDelte = (id) => {
    onDeleteLocation(id);
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
      <TableRow hover tabIndex={-1}>
        <TableCell>{name}</TableCell>
        <TableCell>{cityData?.name}</TableCell>
        <TableCell align="center">
          <Label
            color={
              locationType?.name === 'warehouse'
                ? 'success'
                : locationType?.name === 'branch'
                ? 'error'
                : 'info'
            }
          >
            {locationType?.name}
          </Label>
        </TableCell>
        <TableCell>{address}</TableCell>
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
        <MenuItem onClick={handleEdit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDelte(id)} sx={{ color: 'error.main' }}>
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
  status: PropTypes.string,
  address: PropTypes.string,
  onDeleteLocation: PropTypes.func,
};
