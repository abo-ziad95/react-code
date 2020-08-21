import GoogleMapReact, { Coords, Maps } from "google-map-react";
import React from "react";
import "./style.css";

interface IProps {
  height: string | number;
  center: Coords;
  defaultCenter: Coords;
  onChildMouseEnter?(hoverKey: number): void;
  onChildMouseLeave?(): void;
}

const options = (maps: Maps) => {
  return {
    styles: [
      {
        featureType: "all",
        elementType: "all",
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
        featureType: "landscape",
        elementType: "labels",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "landscape.man_made",
        elementType: "all",
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
        featureType: "poi",
        elementType: "labels",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "transit",
        elementType: "labels",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "water",
        elementType: "all",
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
        featureType: "water",
        elementType: "labels",
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
        bootstrapURLKeys={{ key: "AIzaSyCG2mneJbt80QqrFIuz8dDM_jXLWhZSxUE" }}
        defaultZoom={11.5}
        options={options}
        {...props}
      />
    </div>
  );
};

export default Map;
