import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import React from "react";
import { UserContext } from "../context/user";

interface IHeaders {
  "x-api-key"?: string;
  Authorization?: string;
}

const ApolloContextProvider: React.FC = props => {
  const { state } = React.useContext(UserContext);
  const uri = process.env.REACT_APP_API;
  const headers: IHeaders = {
    "x-api-key": process.env.REACT_APP_API_KEY
  };

  if (state) {
    headers.Authorization = state.session.getAccessToken().getJwtToken();
  }

  const client = new ApolloClient({ uri, headers });

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};

export default ApolloContextProvider;
