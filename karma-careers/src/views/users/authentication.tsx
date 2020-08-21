import Amplify from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";
import * as React from "react";
import { Redirect } from "react-router";
import { SessionContext } from "../../context/session";

Amplify.configure({
  aws_cognito_identity_pool_id:
    "us-west-2:2324055f-ccca-46d0-a95f-304c38de490f",
  aws_cognito_region: "us-west-2",
  aws_user_pools_id: "us-west-2_nb5ddqNKS",
  aws_user_pools_web_client_id: "6tifq0g8d9ii0p81ibioprptse"
});

const Authenticate: React.FC = () => {
  const session = React.useContext(SessionContext);
  if (session.state) {
    return <Redirect to="/" />;
  }
  return null;
};

export default withAuthenticator(Authenticate, {
  signUpConfig: {
    signUpFields: [
      {
        label: "First Name",
        key: "given_name",
        required: true,
        type: "string"
      },
      { label: "Last Name", key: "family_name", required: true, type: "string" }
    ]
  }
});
