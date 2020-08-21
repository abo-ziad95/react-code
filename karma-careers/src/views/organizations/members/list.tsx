import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import GroupIcon from "@material-ui/icons/Group";
import * as React from "react";
import useReactRouter from "use-react-router";
import MuiBreadcrumbs from "../../../components/breadcrumbs";
import MuiDialog from "../../../components/dialog";
import Layout from "../../../components/layout";
import { IMember } from "../../../context/member";
import useDeleteRequest from "../../../hooks/api/useDeleteRequest";
import usePostRequest from "../../../hooks/api/usePostRequest";
import useTextField from "../../../hooks/form/useTextField";
import useGetMembers from "../../../hooks/useGetMembers";
import useGetOrganization from "../../../hooks/useGetOrganization";
import Menu from "../menu";
import useGetRequest from "../../../hooks/api/useGetRequest";
import { IUser } from "../../../context/user";
import config from "../../../config";

interface IProps {
  open: boolean;
  getMembers(): void;
  toggleOpen(): void;
}

interface IRemoveProps {
  id?: string;
  getMembers(): void;
  toggleRemove(): () => void;
}

const useGetUsers = () => {
  const [users, setUsers] = React.useState<IUser[]>([]);
  const { get } = useGetRequest();

  const getUsers = async () => {
    const url = `${config.api}/users`;
    const { data, status } = await get(url);
    if (status === 200) {
      setUsers(data.results);
    }
  };

  const callback = React.useCallback(getUsers, []);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return users;
};

const AddMemberDialog: React.FC<IProps> = props => {
  const users = useGetUsers();
  const { post } = usePostRequest();
  const { match } = useReactRouter();
  const userIndexTextField = useTextField("member", "Select Member");

  const handleSubmit = async () => {
    const index = userIndexTextField.value as number;
    const { id } = match.params as { id: string };
    const url = `https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/members`;
    const data = {
      organization: id,
      full_name: users[index].full_name,
      sub: users[index].sub
    };
    await post(url, {}, data);
    props.getMembers();
    props.toggleOpen();
  };

  return (
    <Dialog open={props.open} onClose={props.toggleOpen}>
      <DialogTitle>Add user to organizations</DialogTitle>
      <DialogContent>
        <TextField {...userIndexTextField.attributes} select={true}>
          {users.map((user, index) => (
            <MenuItem value={index.toString()} key={index}>
              {user.full_name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          disabled={!Boolean(userIndexTextField.value)}
          onClick={handleSubmit}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const RemoveMemberDialog: React.FC<IRemoveProps> = props => {
  const { _delete } = useDeleteRequest();

  const handleDelete = async () => {
    const url = `https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/members/${props.id}`;
    await _delete(url);
    props.getMembers();
    props.toggleRemove();
  };

  return (
    <MuiDialog
      open={Boolean(props.id)}
      title="Remove user from organization"
      body={`Are you sure you want to remove this user from this organization?`}
      handleCancel={props.toggleRemove()}
      handleConfirm={handleDelete}
    />
  );
};

const MembersList = () => {
  const organization = useGetOrganization();
  const { members, getMembers } = useGetMembers();
  const [open, setOpen] = React.useState(false);
  const [remove, setRemove] = React.useState<string>();

  const toggleOpen = () => {
    setOpen(!open);
  };

  const toggleRemove = (member?: IMember) => () => {
    setRemove(member ? member.id : undefined);
  };

  const breadcrumbs = [
    {
      primary: organization ? organization.name : "",
      path: `/organizations/${organization ? organization.id : ""}`
    },
    { primary: "Members" }
  ];

  return (
    <Layout menuComponent={<Menu />} title={organization ? organization.name + " | Members" : undefined}>
      <MuiBreadcrumbs breadcrumbs={breadcrumbs} />
      <div className="wrapper">
        <Grid container={true} spacing={3} justify="center">
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Card>
              <CardHeader title="Members" />
              <Divider />
              <CardContent>
                <List>
                  {members.map((member, index) => (
                    <ListItem
                      button={true}
                      divider={true}
                      key={index}
                      onClick={toggleRemove(member)}
                    >
                      <ListItemIcon>
                        <GroupIcon />
                      </ListItemIcon>
                      <ListItemText primary={member.full_name} />
                    </ListItem>
                  ))}
                  <ListItem divider={true} button={true} onClick={toggleOpen}>
                    <ListItemIcon>
                      <AddIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Add a Member" />
                  </ListItem>
                  <AddMemberDialog open={open} toggleOpen={toggleOpen} getMembers={getMembers} />
                  <RemoveMemberDialog
                    id={remove}
                    toggleRemove={toggleRemove}
                    getMembers={getMembers}
                  />
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default MembersList;
