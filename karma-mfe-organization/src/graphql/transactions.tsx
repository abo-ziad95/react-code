import { gql } from "apollo-boost";

export const GET_TRANSACTIONS = gql`
  query($organization: String!, $first: Int, $after: String) {
    queryKarmaTransactionsByOrganizationDateCreatedIndex(
      organization: $organization
      first: $first
      after: $after
    ) {
      items {
        id
        date_created
        type
        amount
        description
      }
      nextToken
    }
  }
`;
