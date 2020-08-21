import { DrawerContext } from "@hatech/karma-core/context/drawer";
import useHistoryPush from "@hatech/karma-core/hooks/useHistoryPush";
import useSetHead from "@hatech/karma-core/hooks/useSetHead";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";
import React from "react";
import MuiDrawer from "../components/drawer";
import Map from "../components/google/map";
import { JobsContext } from "../context/jobs";
import { LocationContext } from "../context/location";

interface IJob {
  [key: string]: any;
}

interface IBubble {
  active?: number;
  job?: IJob;
}

interface IMarker {
  active?: number;
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
  const { handleClick } = useHistoryPush();

  const job = props.job || {};

  return (
    <div
      className="pin"
      onClick={handleClick(`/job/${job.id}`)}
      id={`${props.index}-marker`}
    />
  );
};

/**
 * React Function Component that renders
 * map marker with Material-UI Tooltip
 */

const ClusterMarker: React.FC<any> = props => {
  const drawer = React.useContext(DrawerContext);
  const toggleDrawer = () => {
    drawer.dispatch({ type: "TOGGLE_DRAWER", payload: "job" });
  };

  return (
    <div
      className="cluster"
      onClick={toggleDrawer}
      id={`${props.index}-marker`}
    >
      <span>{props.quantity}</span>
    </div>
  );
};

/**
 * React Function Component that renders
 * map marker with Pulse and Material-UI Tooltip
 */

const CenterMarker: React.FC<IMarker> = props => (
  <React.Fragment>
    <Tooltip title="You">
      <div
        className="pin"
        style={{ background: "#F00" }}
        id={`${props.index}-marker`}
      />
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

  const job = props.job || {};
  return (
    <Popper
      anchorEl={document.getElementById(`${props.active}-marker`)}
      open={!_.isUndefined(props.active) && !_.isArray(job)}
      placement="top-start"
    >
      <Paper style={{ padding: 12 }}>
        <Typography variant="h6" gutterBottom={true}>
          {job.title ? job.title.replace(regex, "") : null}
        </Typography>
        <Typography component="p">
          {job.company ? job.company.replace(regex, "") : null}
        </Typography>
        {job.description && (
          <Typography>
            {job.description
              ? job.description.replace(regex, "").substring(0, 100)
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
  const [filteredJobs, setFilteredJobs] = React.useState<any[]>([]);
  const [cluster, setCluster] = React.useState<IJob[]>([]);
  const [active, setActive] = React.useState<number>();
  const jobs = React.useContext(JobsContext);
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 5;
  const { handleClick } = useHistoryPush();
  useSetHead({ title: "Job Search Map" });

  const filterJobs = () => {
    const groupedJobs = _.groupBy(jobs.state, "coordinates.lat");
    const arr: any = [];
    Object.keys(groupedJobs).map(key => {
      if (groupedJobs[key].length === 1) {
        arr.push(groupedJobs[key][0]);
      } else if (key !== "undefined") {
        arr.push(groupedJobs[key]);
      }
      return null;
    });
    setFilteredJobs(arr);
  };

  const callback = React.useCallback(filterJobs, [jobs.state]);
  React.useEffect(() => {
    callback();
  }, [callback]);

  const onChildMouseEnter = (hoverKey: number) => {
    const key = Number(hoverKey);
    setActive(key);
    if (_.isArray(filteredJobs[key])) {
      setCluster(filteredJobs[key]);
    }
  };

  const onChildMouseLeave = () => {
    setActive(undefined);
  };

  if (!center) {
    return <Loading />;
  }

  const handlePrevPage = (event: React.MouseEvent) => {
    const newPage = page - 1;
    setPage(newPage);
  };

  const handleNextPage = (event: React.MouseEvent) => {
    const newPage = page + 1;
    setPage(newPage);
  };

  return (
    <Map
      defaultCenter={center}
      center={center}
      height="calc(100vh - 64px)"
      onChildMouseEnter={onChildMouseEnter}
      onChildMouseLeave={onChildMouseLeave}
    >
      <CenterMarker {...center} />
      {filteredJobs.map((job: IJob | IJob[], index: number) => {
        if (_.isArray(job)) {
          return (
            <ClusterMarker
              index={index}
              key={index}
              quantity={job.length}
              lat={job[0].coordinates.lat}
              lng={job[0].coordinates.lng}
            />
          );
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
      <MuiDrawer>
        <div style={{ padding: 6 }}>
          {cluster
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((job: IJob, index: number) => {
              return (
                <div key={index}>
                  <List>
                    <ListItem
                      button={true}
                      onClick={handleClick(`/job/${job.id}`)}
                    >
                      <ListItemText
                        primary={job.title}
                        secondary={`${job.company} ${job.city} ${job.state}, ${
                          job.zip
                        }`}
                      />
                    </ListItem>
                    <Divider />
                  </List>
                </div>
              );
            })}
          <Button
            color="primary"
            size="medium"
            onClick={handlePrevPage}
            disabled={page === 0}
          >
            Prev
          </Button>
          <Button
            color="secondary"
            size="medium"
            onClick={handleNextPage}
            disabled={cluster.length < rowsPerPage}
          >
            Next
          </Button>
        </div>
      </MuiDrawer>
      {!_.isUndefined(active) && (
        <Bubble active={active} job={filteredJobs[active]} />
      )}
    </Map>
  );
};

export default Search;
