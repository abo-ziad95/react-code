import Placeholder from "@hatech/karma-core/components/placeholder";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import React from "react";
import { CandidateContext } from "../../context/candidate";
import Resume from "./resume";

/**
 * Profile component renders information about candidate his Number, email, address
 */

const Profile = () => {
  const candidate = React.useContext(CandidateContext);
  let candidateName = <Placeholder variant="text" width="80%" />;
  let email: React.ReactNode = <Placeholder variant="text"/>;
  let address: React.ReactNode = <Placeholder variant="text"/>;
  let phoneNumber: React.ReactNode = <Placeholder variant="text"/>;

  if (candidate.state) {
    candidateName = candidate.state.applicant.full_name;
    phoneNumber = candidate.state.applicant.phone_number;
    email = candidate.state.applicant.email;
    candidate.state.applicant.addresses && candidate.state.applicant.addresses.length && candidate.state.applicant.addresses[0].address ? address = candidate.state.applicant.addresses[0].address : address = null
  }

  return (
    <Card>
      <CardHeader title={candidateName} action={<Resume />} />
      <Divider />
      <CardContent>
        <List>
          <ListItem divider={true}>
            <ListItemIcon className={"list-item-first-column"}>
              <ListItemText primary={"Number:"}/>
            </ListItemIcon>
            <ListItemText primary={phoneNumber}/>
          </ListItem>
          <ListItem divider={true}>
            <ListItemIcon className={"list-item-first-column"}>
              <ListItemText primary={"Email:"}/>
            </ListItemIcon>
            <ListItemText primary={email}/>
          </ListItem>
          <ListItem divider={true}>
            <ListItemIcon className={"list-item-first-column"}>
              <ListItemText primary={"Address:"}/>
            </ListItemIcon>
            <ListItemText primary={address}/>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default Profile;
