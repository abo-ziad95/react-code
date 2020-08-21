import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import useHistoryPush from "../hooks/router/useHistoryPush";

interface IBreadcrumb {
  primary: string;
  path?: string;
}

interface IProps {
  breadcrumbs: IBreadcrumb[];
}

/**
 * React Function Component that renders
 * Material-UI Breadcrumbs
 * @param props React Function Component parameters
 */

const MuiBreadcrumbs: React.FC<IProps> = props => {
  const { handleClick } = useHistoryPush();
  return (
    <Toolbar>
      <Breadcrumbs>
        {props.breadcrumbs.map((breadcrumb, index) => {
          if (breadcrumb.path) {
            return (
              <Link color="inherit" key={index} onClick={handleClick(breadcrumb.path)}>
                {breadcrumb.primary}
              </Link>
            );
          }

          return (
            <Typography key={index} color="primary">
              {breadcrumb.primary}
            </Typography>
          );
        })}
      </Breadcrumbs>
    </Toolbar>
  );
};

export default MuiBreadcrumbs;
