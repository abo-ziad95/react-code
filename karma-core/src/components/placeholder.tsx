import Skeleton from "@material-ui/lab/Skeleton";
import React from "react";

interface IProps {
  disableAnimate?: boolean | undefined;
  height?: any;
  variant?: "circle" | "text" | "rect" | undefined;
  width?: any;
  style?: React.CSSProperties;
}

const Placeholder: React.FC<IProps> = props => {
  return <Skeleton {...props} />;
};

export default Placeholder;
