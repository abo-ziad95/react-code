import useTextField from "@hatech/karma-core/hooks/useTextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import React from "react";
import ReactInputMask from "react-input-mask";
import { ProfileContext } from "../../../context/profile";
import { CardPlaceholder, ListPlaceholder } from "../../placeholders";

const inputComponent = (props: any) => {
  return <ReactInputMask mask="+1 (999) 999-9999" maskChar=" " {...props} />;
};

/**
 * React Functional Component that displays information about the user
 */

const About: React.FC = () => {
  const profile = React.useContext(ProfileContext);
  const address = useTextField("address", "Address");
  const email = useTextField("email", "Email");
  const fullName = useTextField("full_name", "Name");
  const phoneNumber = useTextField("phone_number", "Phone Number");

  const setProfile = () => {
    if (profile.state) {
      email.setValue(profile.state.email);
      fullName.setValue(profile.state.full_name);
      phoneNumber.setValue(profile.state.phone_number);
    }
  };
  React.useEffect(setProfile, [profile.state]);

  const setProfileAddress = () => {
    if (profile.state && profile.state.addresses) {
      const addresses =
        profile.state.addresses &&
        profile.state.addresses.filter(
          profileAddress => profileAddress.default === true
        );
      address.setValue(addresses.length ? addresses[0].address : undefined);
    }
  };
  React.useEffect(setProfileAddress, [
    profile.state && profile.state.addresses
  ]);

  return (
    <React.Fragment>
      {!profile.state && <CardPlaceholder content={<ListPlaceholder />} />}
      {profile.state && (
        <Card>
          <CardHeader title="My Information" />
          <Divider />
          <CardContent>
            <React.Fragment>
              <TextField {...fullName.attributes} disabled={true} />
              <TextField {...email.attributes} disabled={true} />
              <TextField
                {...phoneNumber.attributes}
                disabled={true}
                InputProps={{ inputComponent }}
              />
              <TextField {...address.attributes} disabled={true} />
            </React.Fragment>
          </CardContent>
        </Card>
      )}
    </React.Fragment>
  );
};

export default About;
