import { gql } from "apollo-boost";

export const GET_JOB = gql`
  query($id: String!) {
    getKarmaJobs(id: $id) {
      id
      title
      description
      organization {
        id
        name
      }
    }
  }
`;

export const GET_ALL_JOBS = gql`
  query($limit: Int, $nextToken: String) {
    listKarmaJobs(limit: $limit, nextToken: $nextToken) {
      items {
        id
        date_created
        organization {
          id
          name
          status
        }
        candidates {
          id
          interviews{
           id
          }
        }
      }
      nextToken
    }
  }
`;

export const GET_JOBS = gql`
  query($organization: String!, $first: Int, $after: String) {
    queryKarmaJobsByOrganizationDateCreatedIndex(
      organization: $organization
      first: $first
      after: $after
    ) {
      items {
        id
        title
        organization {
          id
          name
        }
      }
      nextToken
    }
  }
`;
