import { DrawerContext } from "@hatech/karma-core/context/drawer";
import useHistoryPush from "@hatech/karma-core/hooks/useHistoryPush";
import useTextField from "@hatech/karma-core/hooks/useTextField";
import { useTheme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AddIcon from "@material-ui/icons/List";
import MapIcon from "@material-ui/icons/Map";
import queryString from "query-string";
import React from "react";
import useReactRouter from "use-react-router";
import { LocationContext } from "../context/location";
import PlacesAutoComplete, { IPlacesAutoComplete } from "./google/placesAutoComplete";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles(theme => ({
  form: { padding: theme.spacing(1), whiteSpace: "normal" }
}));

/**
 * React Function Component that renders search form
 * @param props React Function Component parameters
 */

const Search: React.FC = () => {
  const location = React.useContext(LocationContext);
  const router = useReactRouter();
  const classes = useStyles();
  const drawer = React.useContext(DrawerContext);
  const query = queryString.parse(router.location.search);
  const searchTextField = useTextField("search", "Search", query.search as string);
  const distanceTextField = useTextField("distance", "Distance", "25");
  const { push } = useHistoryPush();
  const theme = useTheme();
  const tablet = useMediaQuery(theme.breakpoints.only("sm"));

  const openDrawer = () => {
    drawer.dispatch({ type: "OPEN_DRAWER", payload: "main" });
  };

  const handleSelect = (payload: IPlacesAutoComplete) => {
    location.dispatch({ type: "SET_LOCATION", payload });
  };

  const handleClick = (pathname?: string) => () => {
    const search = searchTextField.value;
    const distance = distanceTextField.value;
    let path = `${pathname}?distance=${distance}`;
    if (search) {
      path += `&search=${encodeURI(search)}`;
    }
    push(path);
    drawer.dispatch({ type: "CLOSE_DRAWER" });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const search = searchTextField.value;
    const distance = distanceTextField.value;
    let path = `${router.location.pathname}?distance=${distance}`;
    if (search) {
      path += `&search=${encodeURI(search)}`;
    }
    push(path);
    drawer.dispatch({ type: "CLOSE_DRAWER" });
  };

  if (tablet && drawer.state !== "main") {
    return (
      <IconButton onClick={openDrawer}>
        <SearchIcon />
      </IconButton>
    );
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <TextField {...searchTextField.attributes} margin="normal" />
      {/* <PlacesAutoComplete handleSelect={handleSelect} /> */}
      <TextField {...distanceTextField.attributes} margin="normal" select={true}>
        <MenuItem value={10}>10 Miles</MenuItem>
        <MenuItem value={25}>25 Miles</MenuItem>
        <MenuItem value={50}>50 Miles</MenuItem>
        <MenuItem value={100}>100 Miles</MenuItem>
      </TextField>
      <Button type="submit" color="primary" variant="contained">
        Search
      </Button>
      {router.location.pathname === "/list" ? (
        <IconButton onClick={handleClick("/map")}>
          <MapIcon />
        </IconButton>
      ) : (
        <IconButton onClick={handleClick("/list")}>
          <AddIcon />
        </IconButton>
      )}
    </form>
  );
};

export default Search;
