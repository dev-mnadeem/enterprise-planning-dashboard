import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useAppSelector } from 'src/state/hooks';
import { selectIsLoading } from 'src/state/reducers/loadingReducer';

// Opt in to React Router v7 behaviour now; all app links are absolute.
export const ROUTER_FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true };

const AppWrapper = ({ children }) => {
  const theme = useTheme();
  const active = useAppSelector(selectIsLoading);

  return (
    <HelmetProvider>
      <BrowserRouter future={ROUTER_FUTURE}>
        <Suspense>
          <Toaster />
          {/* Blocks input while a request is in flight, as the old overlay did,
              so forms can't be submitted twice. */}
          <Backdrop
            open={active}
            sx={{
              zIndex: theme.zIndex.appBar + 2,
              bgcolor: alpha(theme.palette.grey[900], 0.16),
            }}
          >
            <CircularProgress aria-label="Loading" />
          </Backdrop>
          <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default AppWrapper;
