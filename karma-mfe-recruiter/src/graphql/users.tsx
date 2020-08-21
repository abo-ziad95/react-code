import { gql } from "apollo-boost";

export const GET_USERS_LIST = gql`
  query {
    listKarmaUserProfiles {
      items {
        id
        full_name
        status
      }
      nextToken
    }
  }
`;

export const GET_USER = gql`
  query($id: String!) {
    getKarmaUserProfiles(id: $id) {
      id
      full_name
      given_name
      family_name
      email
      phone_number
      addresses {
        address
      }
    }
  }
`;
