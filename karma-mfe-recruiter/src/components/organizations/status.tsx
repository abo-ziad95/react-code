import Placeholder from "@hatech/karma-core/components/placeholder";
import {NotificationContext} from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import useReactRouter from "use-react-router";
import {GET_ORGANIZATION, UPDATE_ORGANIZATION} from "../../graphql/organization";

/**
 * OrganizationStatus component return Organization status info
 * with menu button to change status
 */

const OrganizationStatus = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const notification = React.useContext(NotificationContext);
  let status: React.ReactNode = <Placeholder variant="text" />;
  const { match } = useReactRouter();
  const params = match.params as { organizationId: string; jobId: string };
  const organizationId = params.organizationId;
  const organization = useApolloQuery(GET_ORGANIZATION);
  const updateOrganization = useApolloMutation(UPDATE_ORGANIZATION);

  const effect = () => {
    const variables = { variables: { id: organizationId } };
    organization.execute(variables);
  };
  React.useEffect(effect, []);

  if (organization.data && organization.data.getKarmaOrganizations) {
    status = organization.data.getKarmaOrganizations.status;
  }

  const updatedOrganizationEffect = () => {
    if (updateOrganization.data) {
      notification.dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          message: "Organization has been updated"
        }
      });
    }
  };
  React.useEffect(updatedOrganizationEffect, [updateOrganization.data]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (status: string) => () => {
    const input = {
      id: organizationId,
      status: status
    };

    const variables = { input };
    updateOrganization.execute({ variables });
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Button onClick={handleClick} color="primary" size="small" id="change-status">
        {status}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleStatusChange("active")} className="capitalize" id={"active"}>
          Active
        </MenuItem>
        <MenuItem onClick={handleStatusChange("inactive")} className="capitalize" id={"inactive"}>
          Inactive
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default OrganizationStatus;
