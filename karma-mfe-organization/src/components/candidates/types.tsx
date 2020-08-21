

export interface ICoords {
  lat: number;
  lng: number;
  __typename?: string;
}

export interface IInterview {
  id: string;
  job: IJob;
  datetime: string;
  status: string;
  applicant?: IApplicant;
}
export interface IApplicantDesc{
  full_name: string;
  id?: string;
  __typename?: string;
}
export interface IApplicant {
  applicant: IApplicantDesc;
  id?: string;
  __typename?: string;
}

export interface IJob {
  address?: string;
  city?: string;
  organization: IOrganization;
  coordinates: ICoords;
  description?: string;
  id: string;
  state?: string;
  status?: string;
  title: string;
  zip?: string;
}

export interface IOrganization {
  id: string;
  address?: string;
  city?: string;
  name: string;
  state?: string;
  status: string;
  zip?: string;
}
