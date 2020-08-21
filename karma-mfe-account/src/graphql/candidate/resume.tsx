import { gql } from "apollo-boost";

export const DELETE_CANDIDATE_RESUME = gql`
  mutation CandidateResumes($input: DeleteKarmaUploadsInput!) {
    deleteKarmaUploads(input: $input) {
      id
    }
  }
`;

export const CREATE_CANDIDATE_RESUME = gql`
  mutation CreateCandidateResumes($input: CreateKarmaUploadsInput!) {
    createKarmaUploads(input: $input) {
      id
      date_created
      file
      name
      user
    }
  }
`;

export const LIST_CANDIDATE_RESUMES = gql`
  query ListCandidateResumes($id: String!) {
    listKarmaUploads(filter: { id: { eq: $id } }) {
      items {
        id
        date_created
        file
        name
        user
      }
    }
  }
`;

export const QUERY_CANDIDATE_RESUMES = gql`
  query QueryCandidateResumesByUser($user: String!) {
    queryKarmaUploadsByUserDateCreatedIndex(user: $user) {
      items {
        id
        date_created
        file
        name
        user
      }
    }
  }
`;
