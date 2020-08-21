import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import GroupIcon from "@material-ui/icons/Group";
import * as React from "react";
import useReactRouter from "use-react-router";
import MuiDialog from "../../components/dialog";
import config from "../../config";
import useDeleteRequest from "../../hooks/api/useDeleteRequest";
import useGetRequest from "../../hooks/api/useGetRequest";
import usePutRequest from "../../hooks/api/usePutRequest";
import useTextField from "../../hooks/form/useTextField";
import { SessionContext } from "../../context/session";

interface IProps {
  open: boolean;
  refreshUserGroups(): void;
  toggleOpen(): void;
}

interface IRemoveProps {
  groupName?: string;
  toggleRemove(): () => void;
  refreshUserGroups(): void;
}

const useGetGroups = () => {
  const { get } = useGetRequest();
  const [groups, setGroups] = React.useState<string[]>([]);

  const getGroups = async () => {
    const url = `${config.api}/users/groups`;
    const { data, status } = await get(url);
    if (status === 200) {
      setGroups(data.results);
    }
  };

  const callback = React.useCallback(getGroups, []);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return groups;
};

const useGetUserGroups = () => {
  const { get } = useGetRequest();
  const [groups, setGroups] = React.useState<string[]>([]);
  const { match } = useReactRouter();
  const { id } = match.params as { id: string };

  const getUserGroups = async () => {
    const url = `${config.api}/users/${id}/groups`;
    const { data, status } = await get(url);
    if (status === 200) {
      setGroups(data.results);
    }
  };

  const callback = React.useCallback(getUserGroups, [id]);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return { groups, getUserGroups };
};

const AddGroupDialog: React.FC<IProps> = props => {
  const session = React.useContext(SessionContext);
  const availableGroups = useGetGroups();
  const { put } = usePutRequest();
  const { match } = useReactRouter();
  const groupsTextField = useTextField("group", "Select Group");
  const handleSubmit = async () => {
    const { id } = match.params as { id: string };
    const url = `${config.api}/users/${id}/groups`;
    await put(url, {}, { GroupName: groupsTextField.value });
    if (session.state) {
      await session.state.refreshSession();
    }
    props.refreshUserGroups();
    props.toggleOpen();
  };

  return (
    <Dialog open={props.open} onClose={props.toggleOpen}>
      <DialogTitle>Add user to group</DialogTitle>
      <DialogContent>
        <TextField {...groupsTextField.attributes} select={true}>
          {availableGroups.map((group, index) => (
            <MenuItem value={group} key={index}>
              {group}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button color="primary" disabled={!Boolean(groupsTextField.value)} onClick={handleSubmit}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const RemoveGroupDialog: React.FC<IRemoveProps> = props => {
  const { _delete } = useDeleteRequest();
  const { match } = useReactRouter();

  const handleDelete = async () => {
    const { id } = match.params as { id: string };
    const params = { GroupName: props.groupName };
    const url = `${config.api}/users/${id}/groups`;
    await _delete(url, { params });
    props.refreshUserGroups();
    props.toggleRemove();
  };

  return (
    <MuiDialog
      open={Boolean(props.groupName)}
      title="Remove user from group"
      body={`Are you sure you want to remove this user from the ${props.groupName} group?`}
      handleCancel={props.toggleRemove()}
      handleConfirm={handleDelete}
    />
  );
};

const GroupsControls = () => {
  const { groups, getUserGroups } = useGetUserGroups();
  const [open, setOpen] = React.useState(false);
  const [remove, setRemove] = React.useState<string | undefined>(undefined);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const toggleRemove = (groupName?: string) => () => {
    setRemove(groupName);
  };

  return (
    <Card>
      <CardHeader title="Groups" />
      <Divider />
      <CardContent>
        <List subheader={<ListSubheader>Assigned Groups</ListSubheader>}>
          {groups.map((group, index) => (
            <ListItem button={true} divider={true} key={index} onClick={toggleRemove(group)}>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary={group} />
            </ListItem>
          ))}
          <ListItem divider={true} button={true} onClick={toggleOpen}>
            <ListItemIcon>
              <AddIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Add a Group" />
          </ListItem>
          <AddGroupDialog open={open} toggleOpen={toggleOpen} refreshUserGroups={getUserGroups} />
          <RemoveGroupDialog
            groupName={remove}
            toggleRemove={toggleRemove}
            refreshUserGroups={getUserGroups}
          />
        </List>
      </CardContent>
    </Card>
  );
};

export default GroupsControls;
