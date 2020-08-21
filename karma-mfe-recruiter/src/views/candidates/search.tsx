import { LocationContext } from "@hatech/karma-core/context/location";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { makeStyles, Theme , createStyles} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { Coords } from "google-map-react";
import _ from "lodash";
import React from "react";
import Map from "../../components/google/map";
import {Button, MenuItem, TextField} from "@material-ui/core";
import useTextField from "@hatech/karma-core/hooks/useTextField";
import PlacesAutoComplete, { IPlacesAutoComplete } from "../../components/google/placesAutoComplete";
import Grid from "@material-ui/core/Grid/Grid";

interface IMarker {
  lat: number;
  lng: number;
  index?: number;
}

interface ICandidate {
  id: string;
  first: string;
  last: string;
  coordinates: Coords;
}

interface IBubble {
  active?: number;
  candidate?: ICandidate;
}

const defaultCenter: Coords = {
  lat: 36.2507966,
  lng: -113.6933438
};

/**
 * React Function Component that renders
 * pop when mouse hovers candidate marker
 */

const Bubble: React.FC<IBubble> = props => {
  return (
    <Popper
      anchorEl={document.getElementById(`${props.active}-marker`)}
      open={!_.isUndefined(props.active)}
      placement="top-start"
    >
      <Paper style={{ padding: 12 }}>
        <Typography variant="h6" gutterBottom={true}>
          {props.candidate ? `${props.candidate.first} ${props.candidate.last}` : ""}
        </Typography>
      </Paper>
    </Popper>
  );
};

/**
 * React Function Component that renders
 * map marker with Material-UI Tooltip
 */

const Marker: React.FC<IMarker> = props => {
  return <div className="pin" id={`${props.index}-marker`} />;
};

/**
 * React Function Component that renders
 * map marker with Material-UI Tooltip
 */

const CenterMarker: React.FC<IMarker> = () => (
  <React.Fragment>
    <Tooltip title="You">
      <div className="pin marker" style={{ background: "#F00" }} />
    </Tooltip>
    <div className="pulse" />
  </React.Fragment>
);

const useStyles = makeStyles((theme: Theme) => createStyles(
  {
    searchWrap: {
      margin: "20px",
      background: "transparent",
      position: "absolute"
    },
    search: {
      position: "relative",
      backgroundColor: "rgba(255,255,255,.7)",
      marginLeft: 0,
      width: "280px",
      zIndex: 100
    },
    searchIcon: {
      width: theme.spacing(7),
      height: "100%",
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    inputRoot: {
      color: "inherit"
    },
    inputInput: {
      padding: 0,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: 120,
        "&:focus": {
          width: 200
        }
      }
    }
  }
));

const Search: React.FC = () => {
  const [active, setActive] = React.useState();
  const location = React.useContext(LocationContext);
  const center = location.state ? location.state.coordinates : undefined;
  const [candidates, setCandidates] = React.useState<ICandidate[] | undefined>();
  const classes = useStyles();
  const [url] = React.useState(
    "https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/candidates"
  );
  const [loaded, setLoaded] = React.useState(false);
  const distanceTextField = useTextField("distance", "Distance", "25");
  const searchTextField = useTextField("search", "Search", "");

  const getCandidates = async () => {
    try {
      const response = await axios.get(url);
      setCandidates(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const effect = () => {
    getCandidates();
  };
  React.useEffect(effect, []);

  const onChildMouseEnter = (hoverKey: number) => {
    setActive(hoverKey);
  };

  const onChildMouseLeave = () => {
    setActive(undefined);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const search = searchTextField.value;
    const distance = distanceTextField.value;
    let path = `${url}?distance=${distance}`;
    if (search) {
      path += `&search=${search}`;
    }
    if(location && location.state && location.state.coordinates){
      path += `&lng=${location.state.coordinates.lng}&lat=${location.state.coordinates.lat}`;
    }
    const response = await axios.get(path);
    setCandidates(response.data.results);
  };

  const handleSelect = (payload: IPlacesAutoComplete) => {
    location.dispatch({ type: "SET_LOCATION", payload });
  };

  return (
    <React.Fragment>
      <div className={classes.searchWrap}>
        <form className={classes.search} style={{padding: '12px'}} onSubmit={handleSubmit}>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField {...searchTextField.attributes}  />
            {loaded && (
              <React.Fragment>
                <PlacesAutoComplete handleSelect={handleSelect} />
                <TextField {...distanceTextField.attributes} margin="normal" select={true}>
                  <MenuItem value={10}>10 Miles</MenuItem>
                  <MenuItem value={25}>25 Miles</MenuItem>
                  <MenuItem value={50}>50 Miles</MenuItem>
                  <MenuItem value={100}>100 Miles</MenuItem>
                </TextField>
              </React.Fragment>
            )}
          </Grid>
          <Button type="submit" color="primary" variant="contained">
            Search
          </Button>
        </form>
      </div>
      <Map
        center={center}
        defaultCenter={defaultCenter}
        height="calc(100vh - 66px)"
        onChildMouseEnter={onChildMouseEnter}
        onChildMouseLeave={onChildMouseLeave}
        onLoaded={() => setLoaded(true)}
      >
        {center && <CenterMarker {...center} />}
        {candidates &&
        candidates.map((candidate: any, index: number) => {
          if (!candidate.coordinates) {
            return null;
          }

          return (
            <Marker
              index={index}
              key={index}
              lat={candidate.coordinates.lat}
              lng={candidate.coordinates.lng}
            />
          );
        })}
      </Map>
      {active && candidates && <Bubble active={active} candidate={candidates[active]} />}
    </React.Fragment>
  );
};

export default Search;
