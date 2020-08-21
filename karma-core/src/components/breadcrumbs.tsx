import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import useHistoryPush from "../hooks/useHistoryPush";

export interface IBreadcrumb {
  primary: string | React.ReactNode;
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
    <Breadcrumbs>
      {props.breadcrumbs.map((breadcrumb, index) => {
        if (breadcrumb.path) {
          return (
            <Link color="inherit" key={index} onClick={handleClick(breadcrumb.path)}>
              {breadcrumb.primary}
            </Link>
          );
        } else if (React.isValidElement(breadcrumb.primary)) {
          return React.cloneElement(breadcrumb.primary, { key: index });
        } else {
          return (
            <Typography key={index} color="primary">
              {breadcrumb.primary}
            </Typography>
          );
        }
      })}
    </Breadcrumbs>
  );
};

export default MuiBreadcrumbs;
