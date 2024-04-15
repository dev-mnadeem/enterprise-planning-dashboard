import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { useFormik } from 'formik';
import { useMutation } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';
import { useAppDispatch } from 'src/state/hooks';
import { persistor } from 'src/state/store';
import { storeUser, storeUserSession } from 'src/state/reducers/userReducer';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { logoutUser } from 'src/state/reducers';

// ----------------------------------------------------------------------

export default function LoginView() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [mutate, { loading, error }] = useMutation(ENDPOINTS.LOGIN);

  const startSession = async (response) => {
    if (!response?.token || !response?.permissions || !response?.locations) return;
    try {
      const decoded = jwtDecode(response.token);
      const user = {
        ...JSON.parse(decoded.id),
        permissions: response.permissions,
        locations: response.locations,
      };
      dispatch(storeUserSession({ token: response.token }));
      dispatch(storeUser(user));
      // Write the session to storage before routing on, so a reload straight
      // after sign-in still finds it. The route tree swaps to the protected
      // routes as soon as the session is in the store.
      await persistor.flush();
      router.replace('/');
    } catch {
      dispatch(logoutUser());
      toast.error('The server returned a session this console could not read.');
    }
  };

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async () => {
      if (!values.email || !values.password) {
        return;
      }
      const response = await mutate({
        email: values.email,
        password: values.password,
      });
      await startSession(response);
    },
  });

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const renderForm = (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          fullWidth
          required
          margin="dense"
          value={values.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField
          name="password"
          label="Password"
          required
          type={showPassword ? 'text' : 'password'}
          value={values.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        sx={{ mt: 4 }}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        loading={loading}
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        backgroundColor: 'primary.darker',
        // Cover, not stretch: the artwork used to be squashed to the viewport.
        backgroundImage:
          'linear-gradient(rgb(6 28 54 / 45%), rgb(6 28 54 / 45%)), url(/assets/background/adinkra-cover.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        px: 2,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '100vh', py: 4 }}>
        <Card sx={{ p: { xs: 3, sm: 5 }, width: 1, maxWidth: 420 }}>
          <Logo sx={{ display: 'block', mx: 'auto' }} />

          <Divider sx={{ my: 3 }} />

          <Typography variant="h4" component="h1">
            Sign in
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Adinkra Cargo Movers operations console
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
