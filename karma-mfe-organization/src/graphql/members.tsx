import { gql } from "apollo-boost";

export const GET_MEMBERS = gql`
  query($organization: String!, $first: Int, $after: String) {
    queryKarmaMembersByOrganizationUserIndex(
      organization: $organization
      first: $first
      after: $after
    ) {
      items {
        id
        user {
          id
          full_name
        }
        status
      }
    }
  }
`;

export const INVITE_MEMBER = gql`
  mutation($input: CreateKarmaInvitationsInput!) {
    createKarmaInvitations(input: $input) {
      id
      email
      status
    }
  }
`;

export const UPDATE_MEMBER = gql`
  mutation($input: UpdateKarmaMembersInput!) {
    updateKarmaMembers(input: $input) {
      id
      user {
        id
        full_name
      }
      status
    }
  }
`;

export const GET_INVITATIONS = gql`
  query($filter: TableKarmaInvitationsFilterInput, $limit: Int, $nextToken: String) {
    listKarmaInvitations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        status
      }
      nextToken
    }
  }
`;

export const UPDATE_INVITATION = gql`
  mutation($input: UpdateKarmaInvitationsInput!) {
    updateKarmaInvitations(input: $input) {
      id
      email
      organization {
        id
      }
      type
      status
    }
  }
`;
