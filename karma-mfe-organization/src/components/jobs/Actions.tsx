import { Button, Grid, Menu, MenuItem } from "@material-ui/core";
import React from "react";

interface IProps {
  changeStatusJob: (status:string) => any;
  changeJobType: (jobType:string) => any;
  status: string;
  jobType: string;
}
/**
 * Actions component renders tow dropdown with status of job and type of job.
 */
const Actions: React.FC<IProps> = props => {
  const [anchorEl, setAnchorEl] = React.useState();
  const [anchorElType, setAnchorElType] = React.useState();

  const handleOpenAnchorEl = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };
  const handleOpenAnchorElType = (event: React.MouseEvent) => {
    setAnchorElType(event.currentTarget);
  };

  const handleCloseAnchorEl = () => {
    setAnchorEl(null);
  };
  const handleCloseAnchorElType = () => {
    setAnchorElType(null);
  };

  const handleClick = (status: string, type:string) => () => {
    if(type === 'status'){
      props.changeStatusJob(status)
      setAnchorEl(null);
    }else if(type === 'type'){
      props.changeJobType(status)
      setAnchorElType(null);
    }
  };

  return (
    <React.Fragment>
      <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
        <span>Status: </span>
        <Button id="handleMenu-status" color="primary" size="small" onClick={handleOpenAnchorEl}>
          {props.status}
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseAnchorEl}>
          <MenuItem onClick={handleClick("Active", 'status')}>Active</MenuItem>
          <MenuItem id="selectedStatusJob" onClick={handleClick("InActive", 'status')}>InActive</MenuItem>
        </Menu>
        <span>Job Type: </span>
        <Button id="handleMenu-jobType" color="primary" size="small" onClick={handleOpenAnchorElType}>
          {props.jobType}
        </Button>
        <Menu anchorEl={anchorElType} open={Boolean(anchorElType)} onClose={handleCloseAnchorElType}>
          <MenuItem onClick={handleClick("Full Time", 'type')}>Full Time</MenuItem>
          <MenuItem id="selectedTypeJob" onClick={handleClick("Part Time", 'type')}>Part Time</MenuItem>
          <MenuItem onClick={handleClick("Contract", 'type')}>Contract</MenuItem>
        </Menu>
      </Grid>
    </React.Fragment>
  );
};

export default Actions;
