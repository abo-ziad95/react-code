import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { IMap } from "../../config/interfaces";
import "./map.css";

const containerStyle = {
  width: "100%",
  height: "750px",
};

const center = {
  lat: 26.228223,
  lng: 50.54364,
};

const GMap: React.FC<IMap> = ({ orders }) => {
  const [windowId, setWindowId] = React.useState("");
  const handleToggleOpen = (id: string) => {
    setWindowId(id);
  };
  return (
    <div style={{ position: "relative" }}>
      <LoadScript googleMapsApiKey="AIzaSyCOaRmKAlyoWDirzLQ2ThTeAzuMSjwpHyA">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
          {orders.map((item) => {
            return (
              <div key={item.id}>
                <Marker
                  position={{ lat: item.lat, lng: item.lng }}
                  onClick={() => handleToggleOpen(item.id)}
                />
                {item.id === windowId && (
                  <div className="card">
                    <button
                      onClick={() => setWindowId("")}
                      type="button"
                      className="cardClose"
                    >
                      x
                    </button>
                    <span>id: {item.id}</span>
                    <span>name: {item.name}</span>
                    <span>lat: {item.lat}</span>
                    <span>lng: {item.lng}</span>
                    <span>address: {item.address}</span>
                    <span>
                      deliveryStatus: {item.deliveryStatus || "no status"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GMap;
