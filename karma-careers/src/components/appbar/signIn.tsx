import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as React from "react";
import { SessionContext } from "../../context/session";
import useHistoryPush from "../../hooks/router/useHistoryPush";
import OAuth from "./oAuth";
import { MemberContext } from "../../context/member";

/**
 * React Function Component that renders Material-UI Dialog
 * and Buttons for user sign in
 * @param props React Function Component parameters
 */

const SignIn: React.FC = () => {
  const session = React.useContext(SessionContext);
  const member = React.useContext(MemberContext);
  const { handleClick } = useHistoryPush();
  const [open, setOpen] = React.useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const organization = member.state ? member.state.organization : undefined;

  let accountPath = "/account";

  if (
    session.state &&
    session.state["cognito:groups"] &&
    session.state["cognito:groups"].indexOf("super_admin") === -1 &&
    session.state["cognito:groups"].indexOf("organization_owner") !== -1
  ) {
    accountPath = `/organizations/${organization}/jobs`;
  } else if (
    session.state &&
    session.state["cognito:groups"] &&
    session.state["cognito:groups"].indexOf("super_admin") !== -1
  ) {
    accountPath = `/organizations`;
  }

  return (
    <React.Fragment>
      {!session.state && (
        <Button color="inherit" onClick={toggleOpen} id="signin">
          Sign In
        </Button>
      )}

      {session.state && (
        <Button onClick={handleClick(accountPath)} color="inherit">
          My Account
        </Button>
      )}

      <Dialog open={open} onClose={toggleOpen}>
        <DialogTitle className="capitalize">Sign In</DialogTitle>
        <DialogContent>
          <OAuth />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default SignIn;
