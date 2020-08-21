import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";
import * as React from "react";
import Map from "../../components/google/map";
import Layout from "../../components/layout";
import { DrawerContext } from "../../context/drawer";
import { IJob, JobContext } from "../../context/job";
import { LocationContext } from "../../context/location";
import useReverseGeolocation from "../../hooks/form/useReverseGeolocation";
import useGetJobs from "../../hooks/useGetJobs";
import Apply from "./apply";
import Drawer from "./details";
import SearchForm from "./filter";

interface IBubble {
  active?: number;
  job?: IJob;
}

interface IMarker {
  job?: IJob;
  lat: number;
  lng: number;
  index?: number;
}

/**
 * React Function Component that renders
 * map marker with Material-UI Tooltip
 */

const Marker: React.FC<IMarker> = props => {
  const drawer = React.useContext(DrawerContext);
  const job = React.useContext(JobContext);
  const toggleDrawer = () => {
    drawer.dispatch({ type: "TOGGLE_DRAWER", payload: "job" });
    job.dispatch({ type: "SET_JOB", payload: props.job });
  };
  return (
    <div className="pin" onClick={toggleDrawer} id={`${props.index}-marker`} />
  );
};

/**
 * React Function Component that renders
 * map marker with Pulse and Material-UI Tooltip
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
        <Typography variant="h5">Searching for Jobs around you.</Typography>
      </Grid>
    </Grid>
  </div>
);

/**
 * React Function Component that renders
 * Marker information pop up
 */

const Bubble: React.FC<IBubble> = props => {
  /**
   * Regex pattern that removes all html tags/entities from text
   */
  const regex = /<[^>]*>|&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});/gi;

  if (!props.job) {
    return null;
  }

  return (
    <Popper
      anchorEl={document.getElementById(`${props.active}-marker`)}
      open={!_.isUndefined(props.active)}
      placement="top-start"
    >
      <Paper style={{ padding: 12 }}>
        <Typography variant="h6" gutterBottom={true}>
          {props.job.title ? props.job.title.replace(regex, "") : null}
        </Typography>
        <Typography component="p">
          {props.job.company ? props.job.company.replace(regex, "") : null}
        </Typography>
        {props.job.description && (
          <Typography>
            {props.job.description
              ? props.job.description.replace(regex, "").substring(0, 100)
              : null}
            ...
          </Typography>
        )}
      </Paper>
    </Popper>
  );
};

/**
 * React Function Component that renders
 * Goolgle Map with custom markers
 */

const Search: React.FC = () => {
  const location = React.useContext(LocationContext);
  const center = location.state ? location.state.coordinates : undefined;
  const geoLocation = useReverseGeolocation();
  const [active, setActive] = React.useState();
  const jobs = useGetJobs();

  const setLocation = () => {
    location.dispatch({ type: "SET_LOCATION", payload: geoLocation.results });
  };

  const callback = React.useCallback(setLocation, [geoLocation.results]);
  React.useEffect(() => {
    callback();
  }, [callback]);

  const onChildMouseEnter = (hoverKey: number) => {
    setActive(hoverKey);
  };

  const onChildMouseLeave = () => {
    setActive(undefined);
  };

  return (
    <Layout menuComponent={<SearchForm />} title="Search for your dream job">
      <Drawer />
      <Apply />
      {!center && <Loading />}
      {center && (
        <Map
          center={center}
          defaultCenter={center}
          height="calc(100vh - 66px)"
          onChildMouseEnter={onChildMouseEnter}
          onChildMouseLeave={onChildMouseLeave}
        >
          <CenterMarker {...center} />
          {jobs.map((job, index) => {
            if (!job.coordinates) {
              return null;
            }

            return (
              <Marker
                index={index}
                job={job}
                key={index}
                lat={job.coordinates.lat}
                lng={job.coordinates.lng}
              />
            );
          })}
        </Map>
      )}
      <Bubble active={active} job={jobs[active]} />
    </Layout>
  );
};

export default Search;
