import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%"
  }
}));

export interface IListItem {
  avatar?: React.ReactNode;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  handleClick?: (event: React.MouseEvent) => void;
}

interface IProps {
  items: IListItem[];
}

/**
 * React Function Component that renders
 * Material-UI List
 * @param props React Function Component parameters
 */

const MuiList: React.FC<IProps> = props => {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      {props.items.map((item, index) => (
        <ListItem
          button={Boolean(item.handleClick) as true}
          divider={true}
          key={index}
          onClick={item.handleClick}
        >
          {item.avatar && <ListItemAvatar>{item.avatar}</ListItemAvatar>}
          <ListItemText primary={item.primary} secondary={item.secondary} />
          {item.secondaryAction && (
            <ListItemSecondaryAction>{item.secondaryAction}</ListItemSecondaryAction>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default MuiList;
