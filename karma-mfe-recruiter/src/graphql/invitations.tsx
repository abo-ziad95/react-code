import { gql } from "apollo-boost";

export const CREATE_INVITATION = gql`
  mutation createKarmaInvitations($input: CreateKarmaInvitationsInput!) {
    createKarmaInvitations(input: $input) {
      id
      email
      status
      type
    }
  }
`;

export const GET_INVITATIONS = gql`
  query($organization: String!, $first: Int, $after: String) {
    queryKarmaInvitationsByOrganizationEmailIndex(
      organization: $organization
      first: $first
      after: $after
    ) {
      items {
        id
        email
        status
        organization {
          id
          name
        }
      }
      nextToken
    }
  }
`;
export const UPDATE_INVITATION = gql`
  mutation updateKarmaInvitations($input: UpdateKarmaInvitationsInput!) {
    updateKarmaInvitations(input: $input) {
      id
      status
    }
  }
`;
