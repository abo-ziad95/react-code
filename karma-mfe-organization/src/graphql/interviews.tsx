import { gql } from "apollo-boost";

export const CREATE_INTERVIEW = gql`
  mutation($input: CreateKarmaInterviewsInput!) {
    createKarmaInterviews(input: $input) {
      id
      applicant {
        id
      }
      job {
        id
      }
      datetime
      status
    }
  }
`;

export const GET_INTERVIEWS = gql`
  query($filter: TableKarmaInterviewsFilterInput, $limit: Int, $nextToken: String) {
    listKarmaInterviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        applicant {
          id
          applicant {
            full_name
            id
          }
        }
        id
        datetime
        status
        job {
          id
          title
        }
      }
      nextToken
    }
  }
`;

export const UPDATE_INTERVIEW = gql`
    mutation($input: UpdateKarmaInterviewsInput!) {
        updateKarmaInterviews(input: $input) {
            id
            status
        }
    }
`;
