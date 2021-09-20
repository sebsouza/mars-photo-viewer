import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#451804",
    },
    secondary: {
      main: "#c1440e",
      contrastText: "#fff",
    },
    background: {
      default: "#f0e7e7",
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
