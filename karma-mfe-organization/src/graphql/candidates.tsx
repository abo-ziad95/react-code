import { gql } from "apollo-boost";

export const GET_ALL_CANDIDATES = gql`
  query($limit: Int, $nextToken: String) {
    listKarmaCandidates(limit: $limit, nextToken: $nextToken) {
      items {
        id
        date_created
        status
        job{
          id
          title
          organization{
            id
          }
        }
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

export const GET_CANDIDATES_BY_JOB = gql`
  query($filter: TableKarmaCandidatesFilterInput, $limit: Int, $nextToken: String) {
    listKarmaCandidates(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
          hiring_steps{
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
        profile {
          id
          certifications
          companies
          date_posted
          education
          experience
          industries
          keywords
          languages
          job_type
          salary_range
          skills
        }
      }
      nextToken
    }
  }
`;

export const GET_CANDIDATE = gql`
  query getKarmaCandidates($id: String!) {
    getKarmaCandidates(id: $id) {
      applicant {
        id
        full_name
        email
        phone_number
        addresses{
            address
        }
      }
      interviews {
        status
        datetime
        id
        job{
            id
            title
        }
      }
      date_created
      job {
        id
        title
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
      id
      status
    }
  }
`;

export const UPDATE_CANDIDATE = gql`
  mutation updateKarmaCandidates($input: UpdateKarmaCandidatesInput!) {
    updateKarmaCandidates(input: $input) {
      applicant {
        id
        full_name
      }
      date_created
      job {
        id
        title
      }
      resume {
        id
        name
        file
      }
      interviews {
        status
        datetime
      }
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

export const FILTER_CANDIDATES_PROFILES = gql`
  query($filter: TableKarmaCandidateProfilesFilterInput, $limit: Int, $nextToken: String) {
    listKarmaCandidateProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        certifications
        companies
        date_posted
        education
        experience
        industries
        keywords
        languages
        job_type
        salary_range
        skills
      }
      nextToken
    }
  }
`;
