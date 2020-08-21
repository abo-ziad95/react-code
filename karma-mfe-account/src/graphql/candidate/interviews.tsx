import { gql } from "apollo-boost";

export const QUERY_CANDIDATE_INTERVIEWS = gql`
  query KarmaInterviews($applicant: String!) {
    queryKarmaInterviewsByApplicantJobIndex(applicant: $applicant) {
      items {
        id
        job {
          id
          title
          organization {
            id
            name
          }
        }
        datetime
        status
      }
    }
  }
`;

export const UPDATE_CANDIDATE_INTERVIEWS = gql`
  mutation UpdateKarmaInterviews($input: UpdateKarmaInterviewsInput!) {
    updateKarmaInterviews(input: $input) {
      id
      datetime
      status
    }
  }
`;

export const DELETE_CANDIDATE_INTERVIEWS = gql`
  mutation DeleteKarmaInterviewsInput($input: DeleteKarmaInterviewsInput!) {
    deleteKarmaInterviews(input: $input) {
      id
    }
  }
`;

