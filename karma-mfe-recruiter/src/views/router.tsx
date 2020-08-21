import React from "react";
import {Route, Switch} from "react-router-dom";
import Board from './candidates/board';
import Candidate from "./candidates/profile";
import CandidatesList from "./candidates/list";
import Search from "./candidates/search";
import Job from "./jobs/job";
import JobList from "./jobs/list";
import CreateOrganization from "./organizations/create";
import OrganizationsList from "./organizations/list";
import InvitationsList from "./organizations/members/invitations/list";
import MembersList from "./organizations/members/list";
import Organization from "./organizations/organization";
import UsersList from "./users/list";
import User from "./users/user";
import Dashboard from "./dashboard/dashboard";

const Router: React.FC = () => {
  return (
    <Switch>
      <Route component={Dashboard} exact={true} path="/" />

      <Route component={OrganizationsList} exact={true} path="/organizations" />
      <Route component={CreateOrganization} exact={true} path="/organizations/create" />
      <Route component={Organization} exact={true} path="/organizations/:organizationId" />

      <Route component={Search} exact={true} path="/candidates" />

      <Route component={MembersList} exact={true} path="/organizations/:organizationId/members" />
      <Route
        component={InvitationsList}
        exact={true}
        path="/organizations/:organizationId/members/invitations"
      />

      <Route component={JobList} exact={true} path="/organizations/:organizationId/jobs" />
      <Route component={Job} exact={true} path="/organizations/:organizationId/jobs/:jobId" />

      <Route
        component={CandidatesList}
        exact={true}
        path="/organizations/:organizationId/jobs/:jobId/candidates"
      />
      <Route component={Board} exact={true} path="/organizations/:organizationId/jobs/:jobId/candidates/board" />
      <Route
        component={Candidate}
        exact={true}
        path="/organizations/:organizationId/jobs/:jobId/candidates/:candidateId"
      />
      

      <Route component={UsersList} exact={true} path="/users" />
      <Route component={User} exact={true} path="/users/:id" />
    </Switch>
  );
};

export default Router;
