import { gql } from "apollo-boost";

export const GET_ORGANIZATION = gql`
  query KarmaOrganizations($id: String!) {
    getKarmaOrganizations(id: $id) {
      id
      name
      address
      city
      state
      zip
      status
    }
  }
`;

export const UPDATE_ORGANIZATION = gql`
  mutation updateKarmaOrganizations($input: UpdateKarmaOrganizationsInput!) {
    updateKarmaOrganizations(input: $input) {
      id
      address
      city
      name
      state
      zip
      status
    }
  }
`;

export const CREATE_ORGANIZATION = gql`
  mutation createKarmaOrganizations($input: CreateKarmaOrganizationsInput!) {
    createKarmaOrganizations(input: $input) {
      id
      address
      city
      name
      state
      zip
      status
    }
  }
`;

export const GET_ORGANIZATION_MEMBERS = gql`
  query queryKarmaMembersByOrganizationUserIndex(
    $organization: String!
    $first: Int
    $after: String
  ) {
    queryKarmaMembersByOrganizationUserIndex(
      organization: $organization
      first: $first
      after: $after
    ) {
      items {
        id
        status
        organization {
          id
          name
        }
        user {
          id
          full_name
        }
      }
      nextToken
    }
  }
`;

export const UPDATE_ORGANIZATION_MEMBER = gql`
  mutation updateKarmaMembers($input: UpdateKarmaMembersInput!) {
    updateKarmaMembers(input: $input) {
      id
      status
    }
  }
`;
