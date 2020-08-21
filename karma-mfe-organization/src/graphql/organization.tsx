import { gql } from "apollo-boost";

export const GET_ORGANIZATION = gql`
  query KarmaOrganizations($id: String!) {
    getKarmaOrganizations(id: $id) {
      id
      name
      logo
      state
      zip
      city
      address
      file {
          name 
          id
      }
    }
  }
`;

export const CREATE_LOGO = gql`
    mutation ($input: CreateKarmaUploadsInput!) {
        createKarmaUploads(input: $input) {
            id
            date_created
            file
            name
            user
        }
    }
`;


export const UPDATE_ORGANIZATION = gql`
    mutation ($input: UpdateKarmaOrganizationsInput!) {
        updateKarmaOrganizations(input: $input) {
            id
            name
            coordinates {
                lat
                lng
            }
        }
    }
`;
export const DELETE_ORGANIZATION_LOGO= gql`
    mutation CandidateResumes($input: DeleteKarmaUploadsInput!) {
        deleteKarmaUploads(input: $input) {
            id
        }
    }
`;
