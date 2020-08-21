import { withAuthenticator } from "aws-amplify-react";

export default withAuthenticator(null, true, [], null, null, {
  signUpFields: [
    {
      displayOrder: 6,
      key: "given_name",
      label: "First Name",
      placeholder: "First Name",
      required: true
    },
    {
      displayOrder: 7,
      key: "family_name",
      label: "Last Name",
      placeholder: "Last Name",
      required: true
    }
  ]
});
