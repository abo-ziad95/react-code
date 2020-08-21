import { gql } from "apollo-boost";

export const GET_PREFERENCES = gql`
  query UserPreferences($id: String!) {
    getKarmaUserPreferences(id: $id) {
      id
      sub
      address
      coordinates {
        lat
        lng
      }
    }
  }
`;
