import {gql} from "apollo-boost";

export const GET_ALL_CANDIDATES = gql`
  query($limit: Int, $nextToken: String) {
    listKarmaCandidates(limit: $limit, nextToken: $nextToken) {
      items {
        id
        date_created
        status
      }
      nextToken
    }
  }
`;

export const GET_CANDIDATES = gql`
  query($job: String!, $first: Int, $after: String) {
    queryKarmaCandidatesByJobDateCreatedIndex(job: $job, first: $first, after: $after) {
      items {
        id
        date_created
        status
        applicant {
          id
          full_name
        }
        job {
          id
          title
          organization {
            id
            name
          }
          hiring_steps {
            id
            label
            priority
        }
        }
        resume {
          id
          name
          file
        }
      }
      nextToken
    }
  }
`;
export const GET_CANDIDATE = gql`
  query($id: String!) {
    getKarmaCandidates(id: $id) {
      id
      status
      date_created
      applicant {
        id
        full_name
        email
        phone_number
        addresses {
          address
        }
      }
      job {
        id
        title
        organization {
          id
          name
        }
        hiring_steps {
            id
            label
            priority
        }
      }
    }
  }
`;
export const UPDATE_CANDIDATE = gql`
  mutation updateKarmaCandidates($input: UpdateKarmaCandidatesInput!) {
    updateKarmaCandidates(input: $input) {
      id
      status
    }
  }
`;
export const GET_CANDIDATES_PROFILES = gql`
    query($filter: TableKarmaUserProfilesFilterInput, $limit: Int, $nextToken: String) {
        listKarmaUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                id
                full_name
                addresses {
                    address
                    coordinates {
                        lat
                        lng
                    }
                }
            }
            nextToken
        }
    }
`;