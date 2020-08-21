import GoogleMapReact, { Coords } from "google-map-react";
import * as React from "react";
import "./style.css";

interface IProps {
  height: string | number;
  center?: Coords;
  defaultCenter: Coords;
  onChildMouseEnter?(hoverKey: number): void;
  onChildMouseLeave?(): void;
  onLoaded?(): void;
}

const options = () => {
  return {
    styles: [
      {
        elementType: "all",
        featureType: "all",
        stylers: [
          {
            saturation: "32"
          },
          {
            lightness: "-3"
          },
          {
            visibility: "on"
          },
          {
            weight: "1.18"
          }
        ]
      },
      {
        elementType: "labels",
        featureType: "landscape",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        elementType: "all",
        featureType: "landscape.man_made",
        stylers: [
          {
            saturation: "-70"
          },
          {
            lightness: "14"
          }
        ]
      },
      {
        elementType: "labels",
        featureType: "poi",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        elementType: "labels",
        featureType: "transit",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        elementType: "all",
        featureType: "water",
        stylers: [
          {
            saturation: "100"
          },
          {
            lightness: "-14"
          }
        ]
      },
      {
        elementType: "labels",
        featureType: "water",
        stylers: [
          {
            visibility: "off"
          },
          {
            lightness: "12"
          }
        ]
      }
    ]
  };
};

/**
 * React Function Component that renders Google Map
 * @param props React Function Component parameters
 */

const Map: React.FC<IProps> = props => {
  return (
    <div style={{ height: props.height }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyCG2mneJbt80QqrFIuz8dDM_jXLWhZSxUE&libraries=places" }}
        defaultZoom={11.5}
        options={options}
        onGoogleApiLoaded={props.onLoaded}
        {...props}
      />
    </div>
  );
};

export default Map;
