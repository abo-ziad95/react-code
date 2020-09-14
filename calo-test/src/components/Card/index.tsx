import React from "react";
import "./card.css";
import { ICard } from "../../config/interfaces";

const Card: React.FC<ICard> = ({
  id,
  name,
  lat,
  lng,
  address,
  deliveryStatus,
  changeStatus,
  index,
}) => {
  return (
    <div className="cardWrap">
      <span>id: {id}</span>
      <span>name: {name}</span>
      <span>lat: {lat}</span>
      <span>lng: {lng}</span>
      <span>address: {address}</span>
      <span className={deliveryStatus || "noStatus"}>
        deliveryStatus: {deliveryStatus || "no status"}
      </span>
      <div>
        <button
          onClick={() => changeStatus(index, "delivered")}
          disabled={deliveryStatus === "delivered"}
          type="button"
        >
          mark as delivered
        </button>
        <button
          onClick={() => changeStatus(index, "delivering")}
          disabled={deliveryStatus === "delivering"}
          type="button"
        >
          mark as delivering
        </button>
      </div>
    </div>
  );
};
export default Card;
