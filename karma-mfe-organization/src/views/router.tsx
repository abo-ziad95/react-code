import React from "react";
import { Route, Switch } from "react-router-dom";
import Board from "./candidates/board";
import CalendarView from "./candidates/calendar";
import ApplicantsList from "./candidates/list";
import Candidate from "./candidates/profile";
import Search from "./candidates/search";
import Job from "./jobs";
import CreateJob from "./jobs/create";
import JobEdit from "./jobs/edit";
import JobList from "./jobs/list";
import Members from "./members";
import InvitationsList from "./members/invitations";
import Profile from "./profile";
import Edit from "./settings/edit";

const Router: React.FC = () => {
  return (
    <Switch>
      <Route component={Profile} exact={true} path="/" />
      <Route component={Edit} exact={true} path="/settings" />
      <Route component={JobList} exact={true} path="/jobs" />
      <Route component={CreateJob} exact={true} path="/jobs/create" />
      <Route component={Job} exact={true} path="/jobs/:jobId" />
      <Route component={JobEdit} exact={true} path="/jobs/:jobId/edit" />
      <Route component={ApplicantsList} exact={true} path="/jobs/:jobId/candidates" />
      <Route component={Board} exact={true} path="/jobs/:jobId/candidates/board" />
      <Route component={Candidate} exact={true} path="/jobs/:jobId/candidates/:candidateId" />
      <Route component={Search} exact={true} path="/candidates" />
      <Route component={CalendarView} exact={true} path="/interviews" />
      <Route component={Members} exact={true} path="/members" />
      <Route component={InvitationsList} exact={true} path="/members/invitations" />
    </Switch>
  );
};

export default Router;
