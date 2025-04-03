import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#FFEB3B', 
    },
  },
  typography: {
    fontFamily: 'SourceCodeProLight, Arial',
    h1: {
      fontSize: '2rem',
    },
    body1: {
      fontSize: '18px',
    },
  },
});

export default theme;