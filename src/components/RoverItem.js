import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  ImageList,
  ImageListItem,
  CircularProgress,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import TabPanel from "./TabPanel";

import roverData from "../data/roverData";

const apiKey = process.env.REACT_APP_NASA_KEY;

function RoverItem(props) {
  const [loading, setLoading] = useState(true);
  const [curiosityPhotoData, setCuriosityPhotoData] = useState([]);
  const [curiosityPage, setCuriosityPage] = useState(1);
  const [curiosityCamera, setCuriosityCamera] = useState("all");
  const [earthDate, setEarthDate] = useState(null);
  const [sol, setSol] = useState(null);
  const [emptyData, setEmptyData] = useState(false);

  const handleCuriosityPageChange = (event, value) => {
    setLoading(true);
    setCuriosityPage(value);
  };

  const handleCuriosityCameraChange = (event) => {
    setLoading(true);
    setCuriosityCamera(event.target.value);
    setCuriosityPage(1);
  };

  const handleEarthDateChange = (value) => {
    setLoading(true);
    setEarthDate(formatDate(value));
    setSol(null);
  };

  const handleSolChange = (event) => {
    setLoading(true);
    setSol(event.target.value);
    setEarthDate(null);
  };

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    return [year, month, day].join("-");
  }

  useEffect(() => {
    fetchPhotos();
    async function fetchPhotos() {
      var photosData = [];
      const res = await fetch(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${
          roverData[props.value].name
        }/` +
          (earthDate
            ? `photos?earth_date=${earthDate}&`
            : sol
            ? `photos?sol=${sol}&`
            : `latest_photos?`) +
          `api_key=${apiKey}&page=${curiosityPage}` +
          (curiosityCamera !== "all" ? `&camera=${curiosityCamera}` : "")
      );
      const data = await res.json();
      Object.entries(
        earthDate || sol ? data.photos : data.latest_photos
      ).forEach(([key, value]) =>
        photosData.push({ img: value.img_src, title: value.id })
      );
      setCuriosityPhotoData(photosData);
      photosData.length === 0 ? setEmptyData(true) : setEmptyData(false);
      setLoading(false);
    }
  }, [earthDate, sol, curiosityPage, curiosityCamera, props.value]);

  return (
    <TabPanel value={props.value} index={props.value} className="main">
      <Box className="forms">
        <FormControl id="camera-selector">
          <InputLabel id="select-label">Camera</InputLabel>
          <Select
            labelId="curiosity-camera-label"
            id="curiosity-camera"
            value={curiosityCamera}
            label="Camera"
            onChange={handleCuriosityCameraChange}
          >
            <MenuItem value={"all"}>All</MenuItem>
            {roverData[props.value].cameras.map((camera, index) => {
              return (
                <MenuItem key={index} value={camera.id}>
                  {camera.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <TextField
          id="sol-selector"
          label="Sol"
          variant="outlined"
          onChange={handleSolChange}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Earth Day"
            value={earthDate}
            onChange={handleEarthDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Box>
      {loading ? (
        <CircularProgress className="progress" />
      ) : emptyData ? (
        <Typography variant="h6" className="alert">
          Inexistent photos for selected Earth Day/Sol
        </Typography>
      ) : (
        <Stack spacing={2}>
          <ImageList
            sx={{ width: "auto", height: "auto" }}
            cols={5}
            rowHeight={"auto"}
          >
            {curiosityPhotoData.map((item) => (
              <ImageListItem key={item.img}>
                <img
                  src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                  srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  alt={item.title}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
          <Pagination
            className="pagination"
            count={10}
            page={curiosityPage}
            onChange={handleCuriosityPageChange}
          />
        </Stack>
      )}
    </TabPanel>
  );
}
export default RoverItem;
