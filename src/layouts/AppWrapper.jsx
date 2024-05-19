import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import LoadingOverlay from 'react-loading-overlay';
LoadingOverlay.propTypes = undefined;
import { useAppSelector } from 'src/state/hooks';
import { useTheme } from '@mui/material/styles';

const AppWrapper = ({ children }) => {
  const theme = useTheme();
  const { active } = useAppSelector((state) => state.loadingReducer.active);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense>
          <Toaster />
          <LoadingOverlay
            active={active}
            spinner
            text="Loading..."
            styles={{
              wrapper: {
                width: '100%',
                height: '100%',
                overflow: active ? 'hidden' : 'scroll',
              },
              overlay: (base) => ({
                ...base,
                zIndex: theme.zIndex.appBar + 2,
              }),
            }}
          >
            {children}
          </LoadingOverlay>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default AppWrapper;
