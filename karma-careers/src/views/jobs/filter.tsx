import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import queryString from "query-string";
import * as React from "react";
import useReactRouter from "use-react-router";
import PlacesAutoComplete, {
  IPlacesAutoComplete
} from "../../components/google/placesAutoComplete";
import { DrawerContext } from "../../context/drawer";
import { LocationContext } from "../../context/location";
import useTextField from "../../hooks/form/useTextField";
import useHistoryPush from "../../hooks/router/useHistoryPush";

/**
 * React Function Component that renders search form
 * @param props React Function Component parameters
 */

const Search: React.FC = () => {
  const locationContext = React.useContext(LocationContext);
  const { location } = useReactRouter();
  const drawer = React.useContext(DrawerContext);
  const query = queryString.parse(location.search);
  const searchTextField = useTextField("search", "Search", query.search as string);
  const distanceTextField = useTextField("distance", "Distance", 25);
  const { push } = useHistoryPush();

  const toggleDrawer = () => {
    drawer.dispatch({ type: "TOGGLE_DRAWER" });
  };

  const handleSelect = (payload: IPlacesAutoComplete) => {
    locationContext.dispatch({ type: "SET_LOCATION", payload });
  };

  const submit = async () => {
    let path = `/jobs?map=true`;
    const search = searchTextField.value as string;
    const distance = distanceTextField.value as string;
    if (search) {
      path += `&search=${encodeURI(search)}`;
    }
    if (distance) {
      path += `&distance=${distance}`;
    }
    push(path);
    toggleDrawer();
  };

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3}>
        <Grid item={true} xs={12}>
          <TextField {...searchTextField.attributes} />
        </Grid>
        <Grid item={true} xs={12}>
          <PlacesAutoComplete
            handleSelect={handleSelect}
            value={locationContext.state ? locationContext.state.address : undefined}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <TextField {...distanceTextField.attributes} select={true}>
            <MenuItem value={10}>10 Miles</MenuItem>
            <MenuItem value={25}>25 Miles</MenuItem>
            <MenuItem value={50}>50 Miles</MenuItem>
            <MenuItem value={100}>100 Miles</MenuItem>
          </TextField>
        </Grid>
        <Grid item={true} xs={12}>
          <Button color="primary" onClick={submit} variant="contained">
            Search
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Search;
