import useHistoryPush from "@hatech/karma-core/hooks/useHistoryPush";
import useSetHead from "@hatech/karma-core/hooks/useSetHead";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import qs from "query-string";
import React from "react";
import useReactRouter from "use-react-router";
import Breadcrumbs from "../components/breadcrumbs";
import { IJob, JobsContext } from "../context/jobs";

const JobList: React.FC = () => {
  const { state } = React.useContext(JobsContext);
  const { location } = useReactRouter();
  const query = qs.parse(location.search);
  const [page, setPage] = React.useState(Number(query.page || 0));
  const rowsPerPage = 10;
  const { handleClick, push } = useHistoryPush();
  const setHead = useSetHead({
    title: `Job Search List | Page ${page}`
  });
  const jobs = state.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePrevPage = (event: React.MouseEvent) => {
    const newPage = page - 1;
    setPage(newPage);
    setHead({ title: `Job Search List | Page ${newPage}` });
    push(`/list?page=${newPage}`);
  };

  const handleNextPage = (event: React.MouseEvent) => {
    const newPage = page + 1;
    setPage(newPage);
    setHead({ title: `Job Search List | Page ${newPage}` });
    push(`/list?page=${newPage}`);
  };

  const breadcrumbs = [
    {
      primary: `Jobs`
    }
  ];

  return (
    <div className="wrapper">
      <Grid container={true} justify="center" spacing={3}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <React.Fragment>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Paper>
              <List>
                {jobs.map((job: IJob, index: number) => {
                  return (
                    <ListItem
                      button={true}
                      divider={true}
                      key={index}
                      onClick={handleClick(`/job/${job.id}${location.search}`)}
                    >
                      <ListItemText primary={job.title} secondary={job.city + ", " + job.state} />
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
            <Button color="primary" size="medium" onClick={handlePrevPage} disabled={page === 0}>
              Prev
            </Button>
            <Button
              color="secondary"
              size="medium"
              onClick={handleNextPage}
              disabled={jobs.length < rowsPerPage}
            >
              Next
            </Button>
          </React.Fragment>
        </Grid>
      </Grid>
    </div>
  );
};

export default JobList;
