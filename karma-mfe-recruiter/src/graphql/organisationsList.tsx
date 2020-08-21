import { gql } from "apollo-boost";

export const GET_ORGANIZATIONS_LIST = gql`
  query {
    listKarmaOrganizations {
      items {
        id
        name
        status
      }
      nextToken
    }
  }
`;
