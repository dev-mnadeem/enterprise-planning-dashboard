import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { useFormik } from 'formik';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async () =>
      // await loginUser({
      //   variables: {
      //     input: {
      //       username: values.email,
      //       password: values.password,
      //     },
      //   },
      // }),

      // after user logged in store the user accessToken and refreshToken in Redux "userSession"
      console.log(values.email, values.password),
  });

  const handleClick = () => {
    router.push('/dashboard');
  };

  const renderForm = (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          fullWidth
          margin="dense"
          value={values.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={values.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        // onClick={handleClick}
      >
        Login
      </LoadingButton>
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundImage: 'url(/assets/background/adinkra-cover.png)',
        boxShadow: 'inset 0 0 0 2000px rgb(0 0 0 / 20%)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0% 0%',
        backgroundSize: '100% 100%',
        height: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">
            <Logo
              sx={{
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
          </Typography>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ mt: 2, mb: 4, color: 'text.primary' }}>
              Login to Your Account
            </Typography>
          </Divider>

          {renderForm}

          <Typography variant="body2" sx={{ mt: 2, mb: 0, textAlign: 'center' }}>
            <Link variant="subtitle2">Register as a Customer</Link>
          </Typography>
        </Card>
      </Stack>
    </Box>
  );
}
