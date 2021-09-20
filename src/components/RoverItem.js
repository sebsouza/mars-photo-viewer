import { useEffect, useState } from "react";
import {
  Alert,
  Button,
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
import StarIcon from "@mui/icons-material/Star";
import SaveIcon from "@mui/icons-material/Save";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import TabPanel from "./TabPanel";
import formatDate from "../tools";

import roverData from "../data/roverData";

const apiKey = process.env.REACT_APP_NASA_KEY;

function RoverItem(props) {
  const [loading, setLoading] = useState(true);
  const [roverId, setRoverId] = useState(props.value);
  const [photosData, setPhotosData] = useState([]);
  const [emptyData, setEmptyData] = useState(false);
  const [page, setPage] = useState(null);
  const [camera, setCamera] = useState("all");
  const [formattedEarthDate, setFormattedEarthDate] = useState("");
  const [selectedEarthDate, setSelectedEarthDate] = useState(null);
  const [sol, setSol] = useState("");

  const handlePageChange = (event, value) => {
    setPage(value);
    sessionStorage.setItem(`page_${props.value}`, value);
  };

  const handleCameraChange = (event) => {
    setLoading(true);
    setPage(1);
    sessionStorage.removeItem(`page_${props.value}`);
    setCamera(event.target.value);
    sessionStorage.setItem(`camera_${props.value}`, event.target.value);
  };

  const handleEarthDateChange = (value) => {
    setLoading(true);
    setPage(1);
    sessionStorage.removeItem(`page_${props.value}`);
    sessionStorage.removeItem(`sol_${props.value}`);
    setSol("");
    setSelectedEarthDate(value);
    setFormattedEarthDate(formatDate(value));
    sessionStorage.setItem(`earthDate_${props.value}`, value);
  };

  const handleSolChange = (event) => {
    setLoading(true);
    setPage(1);
    sessionStorage.removeItem(`page_${props.value}`);
    sessionStorage.removeItem(`earthDate_${props.value}`);
    setFormattedEarthDate("");
    setSelectedEarthDate(null);
    setSol(event.target.value);
    sessionStorage.setItem(`sol_${props.value}`, event.target.value);
  };

  const handleResetFilters = () => {
    setPage(1);
    setSol("");
    setFormattedEarthDate("");
    setSelectedEarthDate(null);
    setCamera("all");
    sessionStorage.removeItem(`page_${props.value}`);
    sessionStorage.removeItem(`earthDate_${props.value}`);
    sessionStorage.removeItem(`sol_${props.value}`);
    sessionStorage.removeItem(`camera_${props.value}`);
  };

  const handleSaveBookmark = () => {
    localStorage.removeItem(`earthDate_${props.value}`);
    localStorage.removeItem(`sol_${props.value}`);
    localStorage.removeItem(`camera_${props.value}`);

    if (selectedEarthDate !== null)
      localStorage.setItem(`earthDate_${props.value}`, selectedEarthDate);
    if (sol !== "") localStorage.setItem(`sol_${props.value}`, sol);
    if (camera !== "all") localStorage.setItem(`camera_${props.value}`, camera);
  };

  const handleLoadBookmark = () => {
    setPage(1);

    sessionStorage.removeItem(`page_${props.value}`);
    sessionStorage.removeItem(`earthDate_${props.value}`);
    sessionStorage.removeItem(`sol_${props.value}`);
    sessionStorage.removeItem(`camera_${props.value}`);

    const savedEarthDate = localStorage.getItem(`earthDate_${props.value}`);
    setSelectedEarthDate(savedEarthDate);
    setFormattedEarthDate(
      savedEarthDate === null ? "" : formatDate(savedEarthDate)
    );
    if (savedEarthDate !== null)
      sessionStorage.setItem(`earthDate_${props.value}`, savedEarthDate);

    const savedSol = localStorage.getItem(`sol_${props.value}`);
    setSol(savedSol === null ? "" : savedSol);
    if (savedSol !== null)
      sessionStorage.setItem(`sol_${props.value}`, savedSol);

    const savedCamera = localStorage.getItem(`camera_${props.value}`);
    setCamera(savedCamera === null ? "all" : savedCamera);
    if (savedCamera !== null)
      sessionStorage.setItem(`camera_${props.value}`, savedCamera);
  };

  useEffect(() => {
    setLoading(true);
    setRoverId(props.value);
    const savedCamera = sessionStorage.getItem(`camera_${props.value}`);
    setCamera(savedCamera === null ? "all" : savedCamera);

    const savedPage = sessionStorage.getItem(`page_${props.value}`);
    setPage(savedPage === null ? 1 : Number(savedPage));

    const savedEarthDate = sessionStorage.getItem(`earthDate_${props.value}`);
    setSelectedEarthDate(savedEarthDate);
    setFormattedEarthDate(
      savedEarthDate === null ? "" : formatDate(savedEarthDate)
    );

    const savedSol = sessionStorage.getItem(`sol_${props.value}`);
    setSol(savedSol === null ? "" : savedSol);
  }, [props.value]);

  useEffect(() => {
    console.log("fetch data");
    setPage(1);
    fetchPhotos();

    async function fetchPhotos() {
      var photosData = [];
      const res = await fetch(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverData[roverId].name}/` +
          (formattedEarthDate !== ""
            ? `photos?earth_date=${formattedEarthDate}&`
            : sol !== ""
            ? `photos?sol=${sol}&`
            : `latest_photos?`) +
          `api_key=${apiKey}` +
          (camera !== "all" ? `&camera=${camera}` : "")
      );
      const data = await res.json();
      Object.entries(
        formattedEarthDate !== "" || sol !== ""
          ? data.photos
          : data.latest_photos
      ).forEach(([key, value]) =>
        photosData.push({ img: value.img_src, title: value.id })
      );
      setEmptyData(photosData.length === 0 ? true : false);
      setPhotosData(photosData);
      setLoading(false);
    }
  }, [formattedEarthDate, sol, camera, roverId]);

  return (
    <TabPanel value={props.value} index={props.value} className="main">
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        className="forms"
      >
        <FormControl id="camera-selector">
          <InputLabel id="select-label">Camera</InputLabel>
          <Select
            labelId="curiosity-camera-label"
            id="curiosity-camera"
            value={camera}
            label="Camera"
            onChange={handleCameraChange}
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Earth Day"
            value={selectedEarthDate}
            onChange={handleEarthDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <TextField
          id="sol-selector"
          label="Sol"
          variant="outlined"
          onChange={handleSolChange}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          value={sol}
        />
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        className="forms"
      >
        <Button
          variant="outlined"
          startIcon={<StarIcon />}
          color="secondary"
          onClick={handleSaveBookmark}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          color="secondary"
          onClick={handleLoadBookmark}
        >
          Load
        </Button>
        <Button variant="outlined" onClick={handleResetFilters}>
          Reset
        </Button>
      </Stack>
      {loading ? (
        <CircularProgress className="progress" />
      ) : (
        <div>
          {emptyData ? (
            <div className="alert">
              <Alert variant="outlined" severity="error">
                Inexisting photos for selected Earth Day/Sol
              </Alert>
            </div>
          ) : (
            <Stack spacing={2}>
              <ImageList
                sx={{ width: "auto", height: "auto" }}
                cols={5}
                rowHeight={"auto"}
              >
                {photosData.slice(25 * (page - 1), 25 * page).map((item) => (
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
                siblingCount={2}
                count={Math.ceil(photosData.length / 25)}
                page={page}
                onChange={handlePageChange}
              />
            </Stack>
          )}
        </div>
      )}
    </TabPanel>
  );
}
export default RoverItem;
