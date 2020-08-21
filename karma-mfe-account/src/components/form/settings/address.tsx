import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import CheckIcon from "@material-ui/icons/CheckCircle";
import React from "react";
import { IAddress } from "../../types";
import Action from "./action";

interface IProps {
  address: IAddress;
  resetAddresses(newAddresses: IAddress[]): void;
}

interface ICheck {
  primary?: boolean;
}

/**
 * A React Functional Component that formats an address in a list format
 * @param props
 */

const RenderCheckbox: React.FC<ICheck> = props => {
  if (!props.primary) {
    return null;
  }
  return (
    <FormControlLabel
      control={
        <Checkbox
          color="secondary"
          checked={props.primary}
          checkedIcon={<CheckIcon />}
        />
      }
      label="Primary"
    />
  );
};

const Address: React.FC<IProps> = props => {
  return (
    <List>
      <ListItem divider={true}>
        <ListItemText
          primary={props.address.address}
          secondary={<RenderCheckbox primary={props.address.default} />}
        />
        <Action address={props.address} resetAddresses={props.resetAddresses} />
      </ListItem>
    </List>
  );
};

export default Address;
