import { gql } from "apollo-boost";

export const GET_ALL_JOBS = gql`
  query($filter: TableKarmaJobsFilterInput, $limit: Int, $nextToken: String) {
    listKarmaJobs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        date_created
        title
        organization {
          id
          name
          status
        }
        candidates {
          id
          interviews {
            id
          }
        }
      }
      nextToken
    }
  }
`;

export const GET_JOB = gql`
  query KarmaJobs($id: String!) {
    getKarmaJobs(id: $id) {
      id
      status
      title
      description
      address
      city
      state
      jobType
      zip
      hiring_steps {
        id
        label
        priority
      }
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
        status
        candidates {
          id
          status
        }
      }
      nextToken
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation createKarmaTransactions($input: CreateKarmaTransactionsInput!) {
    createKarmaTransactions(input: $input) {
      id
      date_created
      type
      amount
    }
  }
`;

export const UPDATE_JOB = gql`
  mutation($input: UpdateKarmaJobsInput!) {
    updateKarmaJobs(input: $input) {
      id
      title
      description
      status
      jobType
      hiring_steps {
        id
        label
        priority
      }
    }
  }
`;

export const DELETE_JOB = gql`
  mutation($input: DeleteKarmaJobsInput!) {
    deleteKarmaJobs(input: $input) {
      id
    }
  }
`;

export const CREATE_JOB = gql`
  mutation($input: CreateKarmaJobsInput!) {
    createKarmaJobs(input: $input) {
      id
      title
      description
      hiring_steps {
        id
        label
        priority
      }
    }
  }
`;
