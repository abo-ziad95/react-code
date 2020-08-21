import { gql } from "apollo-boost";

export const GET_JOB = gql`
  query KarmaJobs($id: String!) {
    getKarmaJobs(id: $id) {
      id
      city
      company
      coordinates {
        lat
        lng
      }
      country
      date
      date_created
      description
      jobType
      organization {
        id
        address
        city
        name
        state
        zip
      }
      state
      status
      title
      zip
    }
  }
`;

export const QUERY_JOBS = gql`
  query KarmaJobsByStatus($status: String!) {
    queryKarmaJobsByStatusDateCreatedIndex(status: $status, first: 100) {
      items {
        id
        city
        company
        coordinates {
          lat
          lng
        }
        country
        date
        date_created
        description
        jobType
        organization {
          id
          address
          city
          name
          state
          zip
        }
        state
        status
        title
        zip
      }
      nextToken
    }
  }
`;
