import { NotificationContext } from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React from "react";
import { ProfileContext } from "../../../context/profile";
import { UPDATE_PROFILE } from "../../../graphql/user/profile";
import { IAddress } from "../../types";

interface IProps {
  address: IAddress;
  resetAddresses(newAddresses: IAddress[]): void;
}

/**
 * A React Functional Component that allows a user to set an address to primary/default
 */

const Action: React.FC<IProps> = props => {
  const notifications = React.useContext(NotificationContext);
  const profile = React.useContext(ProfileContext);
  const updateProfile = useApolloMutation(UPDATE_PROFILE);
  const [addresses, setAddresses] = React.useState<IAddress[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const setAddressState = () => {
    if (profile.state && profile.state.addresses) {
      setAddresses(profile.state.addresses);
    }
  };
  React.useEffect(setAddressState, [profile.state]);

  const mutationEffect = () => {
    if (updateProfile.data) {
      handleNotifications("Profile Updated");
    }
  };
  React.useEffect(mutationEffect, [updateProfile.data]);

  const handleNotifications = (message: any) => {
    notifications.dispatch({
      payload: {
        message
      },
      type: "ADD_NOTIFICATION"
    });
  };

  const handleTypeNameDelete = () => {
    if (addresses) {
      const newAddresses = addresses.map(address => {
        delete address.__typename;
        delete address.coordinates.__typename;
        return address;
      });
      setAddresses(newAddresses);
    }
  };

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!event.currentTarget) {
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDefault = () => {
    const newAddresses = addresses.map(address => {
      if (address.coordinates === props.address.coordinates) {
        address.default = true;
      } else {
        address.default = false;
      }
      return address;
    });
    props.resetAddresses(newAddresses);
    const params = {
      addresses: newAddresses,
      id: profile.state && profile.state.id
    };
    handleTypeNameDelete();
    const variables = { input: params };
    updateProfile.execute({ variables });
    handleClose();
  };

  const handleDelete = () => {
    const newAddresses = addresses.filter(address => address !== props.address);
    props.resetAddresses(newAddresses);
    handleClose();
    const params = {
      addresses: newAddresses,
      id: profile.state && profile.state.id
    };
    handleTypeNameDelete();
    const variables = { input: params };
    updateProfile.execute({ variables });
  };

  return (
    <React.Fragment>
      <IconButton id="address-icon" onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="address-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem id="address-menu-icon-default" onClick={handleDefault}>Make Default</MenuItem>
        <MenuItem id="address-menu-icon-delete" onClick={handleDelete}>Delete Address</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default Action;
