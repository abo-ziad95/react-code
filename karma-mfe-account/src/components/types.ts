export interface IAddress {
  default?: boolean;
  type?: string;
  coordinates: ICoords;
  address: string;
  __typename?: string;
}

export interface IApplication {
  applicant: string;
  date_created: string;
  id: string;
  interviews: IInterview[];
  job: IJob;
  resume: string;
  status: string;
}

export interface ICandidate {
  date_posted: string
  education: string
  experience: string
  id: string
  industries: string[]
  keywords: string[]
  salary_range: string
  job_type: string[]
}

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
}

export interface IJob {
  address?: string;
  city?: string;
  organization: IOrganization;
  coordinates: ICoords;
  description?: string;
  hiring_steps?: IStep[]
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

export interface IResume {
  id: string;
  date_created: string;
  file: string;
  name: string;
  user: string;
}

export interface IStep {
  priority: number;
  id: string;
  label: string;
}