import * as React from "react";
import video from "./splash.mp4";

const style: React.CSSProperties = {
  bottom: 0,
  height: "100%",
  overflow: "hidden",
  position: "absolute",
  top: 0,
  width: "100%",
  zIndex: -100
};

const videoStyle: React.CSSProperties = {
  height: "auto",
  left: "50%",
  minHeight: "100%",
  minWidth: "100%",
  position: "absolute",
  top: "50%",
  transform: "translate(-50%,-50%)",
  width: "auto"
};

const SplashVideo: React.FC = () => {
  return (
    <div style={style}>
      <video autoPlay={true} loop={false} muted={true} style={videoStyle}>
        <source src={video} type="video/mp4" />
      </video>
    </div>
  );
};

export default SplashVideo;
