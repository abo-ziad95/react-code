import useMediaQuery from "@material-ui/core/useMediaQuery";
import * as React from "react";
import Desktop from "./desktop";
import Mobile from "./mobile";

interface IProps {
  menuComponent: React.ReactNode;
  title?: string;
}

/**
 * React Function Component that renders layout dependent on view width
 * @param props React Function Component parameters
 */

const Layout: React.FC<IProps> = props => {
  const mobile = useMediaQuery("(max-width:600px)");
  const tablet = useMediaQuery("(max-width:960px)");

  if (mobile) {
    return <Mobile {...props} />;
  }

  if (tablet) {
    return <Mobile {...props} />;
  }

  return <Desktop {...props} />;
};

export default Layout;
