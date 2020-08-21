import AppBar from "@material-ui/core/AppBar";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MenuIcon from "@material-ui/icons/Menu";
import * as React from "react";
import config from "../../config";
import { DrawerContext } from "../../context/drawer";
import useHistoryPush from "../../hooks/router/useHistoryPush";
import SignIn from "./signIn";

interface IProps {
  className?: string;
  position?: "fixed" | "absolute" | "sticky" | "static" | "relative";
}

/**
 * React Function Component that renders Material-UI AppBar
 * @param props React Function Component parameters
 */

const Appbar: React.FC<IProps> = props => {
  const drawer = React.useContext(DrawerContext);
  const { handleClick } = useHistoryPush();
  const tablet = useMediaQuery("(max-width:960px)");
  const openDrawer = () => {
    drawer.dispatch({ type: "TOGGLE_DRAWER", payload: "main" });
  };

  return (
    <AppBar className={props.className} position={props.position}>
      <Toolbar disableGutters={tablet}>
        <Hidden mdUp={true}>
          <IconButton color="primary" onClick={openDrawer}>
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Typography color="inherit" onClick={handleClick("/")} style={{ flex: 1 }} variant="h6">
          {config.title}
        </Typography>
        <SignIn />
      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
