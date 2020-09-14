import React, { useEffect, useLayoutEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import data from "../data.json";
import Card from "../components/Card";
import { IOrders } from "../config/interfaces";

const List: React.FC = () => {
  const [orders, setOrders] = useState<IOrders[]>([]);
  const {
    location: { search },
  } = useHistory();
  const addItems = () => {
    // to get more items with unique id
    const moreItems = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34].map((item) => {
      return {
        id: String(item + orders.length),
        name: "name",
        lat: 1,
        lng: 1,
        address: "string",
        deliveryStatus:
          search.split("?")[1] !== "new" ? "delivered" : "delivering",
      };
    });
    data.push(...moreItems);
    setOrders([...orders, ...moreItems]);
  };
  const handleScroll = () => {
    const wrap: HTMLElement | null = document.querySelector("#wrap");
    if (wrap) {
      const definitelyAnElement: HTMLElement = wrap;
      const yOffset = window.pageYOffset;
      const y = yOffset + window.innerHeight;
      if (y >= definitelyAnElement.offsetHeight) {
        addItems();
      }
    }
  };
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
  useLayoutEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  const changeStatus = (index: number, status: string) => {
    // if we had backend that func will work differently, that the one way who i can manipulate my data.json
    let newData = null;
    let changedItem = null;
    if (search === "?delivered") {
      newData = data.filter((item) => item.deliveryStatus === "delivered");
      changedItem = newData.splice(index, 1);
      changedItem[0].deliveryStatus = status;
      setOrders([
        ...data.filter((item) => item.deliveryStatus === "delivered"),
      ]);
    } else {
      newData = data.filter((item) => item.deliveryStatus !== "delivered");
      changedItem = newData.splice(index, 1);
      changedItem[0].deliveryStatus = status;
      setOrders([
        ...data.filter((item) => item.deliveryStatus !== "delivered"),
      ]);
    }
  };
  return (
    <div className="cardsWrap">
      {orders.map((order, index) => {
        return (
          <Card
            index={index}
            changeStatus={changeStatus}
            key={index}
            {...order}
          />
        );
      })}
    </div>
  );
};

export default List;
