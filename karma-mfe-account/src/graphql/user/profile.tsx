import { gql } from "apollo-boost";

export const GET_PROFILE = gql`
  query UserProfiles($id: String!) {
    getKarmaUserProfiles(id: $id) {
      id
      addresses {
        address
        coordinates {
          lat
          lng
        }
        default
        type
      }
      email
      family_name
      full_name
      given_name
      phone_number
    }
  }
`;

export const CREATE_PROFILE = gql`
  mutation UserProfiles($input: CreateKarmaUserProfilesInput!) {
    createKarmaUserProfiles(input: $input) {
      id
      addresses {
        address
        coordinates {
          lat
          lng
        }
        default
        type
      }
      email
      family_name
      full_name
      given_name
      phone_number
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UserProfiles($input: UpdateKarmaUserProfilesInput!) {
    updateKarmaUserProfiles(input: $input) {
      id
      addresses {
        address
        coordinates {
          lat
          lng
        }
        default
        type
      }
      email
      family_name
      full_name
      given_name
      phone_number
    }
  }
`;
