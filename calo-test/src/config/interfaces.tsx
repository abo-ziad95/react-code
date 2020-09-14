export interface ICard {
  id: string;
  name: string;
  lat: number;
  lng: number;
  index: number;
  address: string;
  deliveryStatus?: string;
  changeStatus: (key: number, status: string) => void;
}
export interface IOrders {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  deliveryStatus?: string;
}
export interface IHeader {
  setParam: (searchParam: string) => void;
  activeBtn: string;
}
export interface IMap {
  orders: IOrders[];
}
