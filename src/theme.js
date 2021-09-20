import { createTheme } from "@mui/material/styles";

const theme = createTheme({
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

export default theme;
