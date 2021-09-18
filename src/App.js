import { useState } from "react";
import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from "@mui/material";

import RoverItem from "./components/RoverItem";

import "./App.css";
import "@fontsource/roboto/300.css";

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
    <Box className="app">
      <AppBar position="sticky">
        <Toolbar className="header">
          <Typography variant="h5">Mars Photo Viewer</Typography>
        </Toolbar>
        <Box className="tabs">
          <Tabs
            value={selectedRover}
            onChange={handleRoverChange}
            aria-label="rover selection tabs"
          >
            <Tab label="Curiosity" {...a11yProps(0)} />
            <Tab label="Opportunity" {...a11yProps(1)} />
            <Tab label="Spirit" {...a11yProps(2)} />
          </Tabs>
        </Box>
      </AppBar>

      <RoverItem value={selectedRover} />
    </Box>
  );
}

export default App;
