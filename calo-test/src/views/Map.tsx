import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import GMap from "../components/GoogleMap/index";
import data from "../data.json";
import { IOrders } from "../config/interfaces";

const Map: React.FC = () => {
  const [orders, setOrders] = useState<IOrders[]>([]);
  const {
    location: { search },
  } = useHistory();
  useEffect(() => {
    if (search === "?delivered")
      setOrders([
        ...data.filter((item) => item.deliveryStatus === "delivered"),
      ]);
    else
      setOrders([
        ...data.filter((item) => item.deliveryStatus !== "delivered"),
      ]);
  }, [search]);
  return (
    <div>
      <GMap orders={orders} />
    </div>
  );
};

export default Map;
