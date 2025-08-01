import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Example primary color (Material Design Blue)
    },
    secondary: {
      main: '#dc004e', // Example secondary color (Material Design Red)
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
      marginBottom: '1rem',
    },
    // You can add more typography customizations here
  },
  // You can customize other aspects like spacing, breakpoints, etc.
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevent uppercase transform on buttons
        },
      },
    },
  },
});

export default theme;