import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { Coords } from "google-map-react";
import _ from "lodash";
import * as React from "react";
import Map from "../../../components/google/map";
import Layout from "../../../components/layout";
import Menu from "../menu";
import { LocationContext } from "../../../context/location";
import useGetCandidates from "../../../hooks/useGetCandidates";
import useReverseGeolocation from "../../../hooks/form/useReverseGeolocation";

interface IMarker {
  lat: number;
  lng: number;
  index?: number;
}

interface ICandidate {
  id: string;
  full_name: string;
  coordinates: Coords;
}

interface IBubble {
  active?: number;
  candidate?: ICandidate;
}

const defaultCenter = {
  lat: 36.2507966,
  lng: -113.6933438
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
      <div className="pin" style={{ background: "#F00" }} />
    </Tooltip>
    <div className="pulse" />
  </React.Fragment>
);

/**
 * React Function Component that renders
 * Loading View
 */

const Loading: React.FC = () => (
  <div className="wrapper">
    <Grid
      alignItems="center"
      container={true}
      direction="row"
      justify="center"
      spacing={3}
      style={{ height: "80vh", textAlign: "center" }}
    >
      <Grid item={true} xs={12}>
        <CircularProgress style={{ marginBottom: 24 }} />
        <Typography variant="h5">Searching for Candidates around you.</Typography>
      </Grid>
    </Grid>
  </div>
);

/**
 * React Function Component that renders
 * Marker information pop up
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
          {props.candidate ? props.candidate.full_name : ""}
        </Typography>
      </Paper>
    </Popper>
  );
};

/**
 * React Function Component that renders
 * Goolgle Map with custom markers
 */

const Search: React.FC = () => {
  const [active, setActive] = React.useState();
  const location = React.useContext(LocationContext);
  const center = location.state ? location.state.coordinates : undefined;
  const geoLocation = useReverseGeolocation();
  const candidates = useGetCandidates();

  React.useEffect(() => {
    location.dispatch({ type: "SET_LOCATION", payload: geoLocation.results });
    // return geoLocation.source.cancel();
  }, [geoLocation, location]);

  const onChildMouseEnter = (hoverKey: number) => {
    setActive(hoverKey);
  };

  const onChildMouseLeave = () => {
    setActive(undefined);
  };

  return (
    <Layout menuComponent={<Menu />} title="Candidates around me">
      {!center && <Loading />}
      {center && (
        <Map
          center={center}
          defaultCenter={defaultCenter}
          height="calc(100vh - 66px)"
          onChildMouseEnter={onChildMouseEnter}
          onChildMouseLeave={onChildMouseLeave}
        >
          <CenterMarker {...center} />
          {candidates.map((candidate, index) => {
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
      )}
      <Bubble active={active} candidate={candidates[active]} />
    </Layout>
  );
};

export default Search;
