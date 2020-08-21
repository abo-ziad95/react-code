import Snackbar from "@material-ui/core/Snackbar";
import * as React from "react";

interface IProps {
  message: string;
}

/**
 * React Function Component that renders
 * Material-UI Snackbar
 * @param props React Function Component parameters
 */

const MuiSnackbar: React.FC<IProps> = props => {
  const [open, setOpen] = React.useState(true);

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <Snackbar
      open={open}
      message={<span>{props.message}</span>}
      autoHideDuration={4000}
      onClose={toggleOpen}
    />
  );
};

export default MuiSnackbar;
