import { useState } from "react";
import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import RoverItem from "./components/RoverItem";
import theme from "./theme";
import "./App.css";
import "@fontsource/roboto/400.css";
import logo from "./logo.png";

import roverData from "./data/roverData";

function App() {
  const [selectedRover, setSelectedRover] = useState(0);

  const handleRoverChange = (event, value) => {
    setSelectedRover(value);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app">
        <AppBar position="sticky">
          <Toolbar className="header">
            <img src={logo} alt="Mars" id="logo" />
            <Typography variant="h4">Mars Photo Viewer</Typography>
          </Toolbar>
          <AppBar className="tabs" position="sticky" color="secondary">
            <Tabs
              value={selectedRover}
              onChange={handleRoverChange}
              aria-label="rover selection tabs"
              indicatorColor="primary"
              textColor="inherit"
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
            >
              {roverData.map((rover, index) => {
                return (
                  <Tab key={index} label={rover.name} {...a11yProps(index)} />
                );
              })}
            </Tabs>
          </AppBar>
        </AppBar>
        <RoverItem value={selectedRover} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
