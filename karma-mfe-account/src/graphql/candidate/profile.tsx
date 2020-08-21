import { gql } from "apollo-boost";

export const GET_CANDIDATE_PROFILE = gql`
  query CandidateProfiles($id: String!) {
    getKarmaCandidateProfiles(id: $id) {
      id
      certifications
      companies
      date_posted
      education
      experience
      industries
      job_type
      keywords
      languages
      salary_range
      skills
    }
  }
`;

export const UPDATE_CANDIDATE_PROFILE = gql`
  mutation CandidateProfiles($input: UpdateKarmaCandidateProfilesInput!) {
    updateKarmaCandidateProfiles(input: $input) {
      id
      certifications
      companies
      date_posted
      education
      experience
      industries
      job_type
      keywords
      languages
      salary_range
      skills
    }
  }
`;

export const CREATE_CANDIDATE_PROFILE = gql`
  mutation CandidateProfiles($input: CreateKarmaCandidateProfilesInput!) {
    createKarmaCandidateProfiles(input: $input) {
      id
      certifications
      companies
      date_posted
      education
      experience
      industries
      job_type
      keywords
      languages
      salary_range
      skills
    }
  }
`;
