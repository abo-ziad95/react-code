import { Button, Grid, Menu, MenuItem } from "@material-ui/core";
import React from "react";
/**
 * CreateActions component renders dropdown with type of job.
 */
interface IProps {
  changeJobType: (jobType:string) => any;
  jobType: string;
}
const CreateActions: React.FC<IProps> = props => {
  const [anchorElType, setAnchorElType] = React.useState();
  const handleOpenAnchorElType = (event: React.MouseEvent) => {
    setAnchorElType(event.currentTarget);
  };
  const handleCloseAnchorElType = () => {
    setAnchorElType(null);
  };

  const handleClick = (status: string) => () => {
      props.changeJobType(status)
      setAnchorElType(null);
  };

  return (
    <React.Fragment>
      <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
        <span>Job Type: </span>
        <Button id="handleMenu" color="primary" size="small" onClick={handleOpenAnchorElType}>
          {props.jobType}
        </Button>
        <Menu anchorEl={anchorElType} open={Boolean(anchorElType)} onClose={handleCloseAnchorElType}>
          <MenuItem onClick={handleClick("Full Time")}>Full Time</MenuItem>
          <MenuItem onClick={handleClick("Part Time")}>Part Time</MenuItem>
          <MenuItem id="selectedTypeJob" onClick={handleClick("Contract")}>Contract</MenuItem>
        </Menu>
      </Grid>
    </React.Fragment>
  );
};

export default CreateActions;
