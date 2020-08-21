import { gql } from "apollo-boost";

export const GET_CANDIDATE_APPLICATION = gql`
  query GetCandidateApplication($id: String!) {
    getKarmaCandidates(id: $id) {
        id
        applicant {
          id
          full_name
          given_name
          family_name
          email
          phone_number
          addresses {
            address
            coordinates {
              lat
              lng
            }
            default
            type
          }
        }
        date_created
        interviews {
          id
          job {
            id
            city
            company
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
          datetime
          status
        }
        resume {
          id
          date_created
          file
          name
          user
        }
        status
        job {
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
          hiring_steps{
              id
              label
              priority
          }
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
    }
`;

export const QUERY_CANDIDATE_APPLICATIONS = gql`
  query QueryCandidateApplications($applicant: String!) {
    queryKarmaCandidatesByApplicantDateCreatedIndex(applicant: $applicant) {
      items {
        id
        applicant {
          id
          full_name
          given_name
          family_name
          email
          phone_number
          addresses {
            address
            coordinates {
              lat
              lng
            }
            default
            type
          }
        }
        date_created
        interviews {
          id
          job {
            id
            city
            company
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
          datetime
          status
        }
        resume {
          id
          date_created
          file
          name
          user
        }
        status
        job {
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
          hiring_steps{
              id
              label
              priority
          }
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
    }
  }
`;

export const UPDATE_CANDIDATE_APPLICATION = gql`
  mutation UpdateCandiatesApplication($input: UpdateKarmaCandidatesInput!) {
    updateKarmaCandidates(input: $input) {
      id
      status
    }
  }
`;

export const DELETE_CANDIDATE_APPLICATION = gql`
  mutation DeleteCandiatesApplication($input: DeleteKarmaCandidatesInput!) {
    deleteKarmaCandidates(input: $input) {
      id
    }
  }
`;
