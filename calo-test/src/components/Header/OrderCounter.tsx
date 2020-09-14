import React from "react";
import "./Header.css";
import data from "../../data.json";

const OrderCounter: React.FC = () => {
  const total = data.length;
  const delivered = data.filter(
    ({ deliveryStatus }) => deliveryStatus === "delivered"
  ).length;

  return (
    <div style={{ width: "100px" }}>
      {delivered}/{total}
    </div>
  );
};
export default OrderCounter;
