import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Switch from "@material-ui/core/Switch";
import OrgIcon from "@material-ui/icons/Business";
import PersonIcon from "@material-ui/icons/Person";
import WorkIcon from "@material-ui/icons/Work";
import * as React from "react";
import useReactRouter from "use-react-router";
import config from "../../config";
import useGetRequest from "../../hooks/api/useGetRequest";
import usePutRequest from "../../hooks/api/usePutRequest";

interface IPermissions {
  create_organization: boolean;
  edit_organization: boolean;
  delete_organization: boolean;
  create_job: boolean;
  edit_job: boolean;
  delete_job: boolean;
  add_user: boolean;
  remove_user: boolean;
  edit_user_permissions: boolean;
}

const initialPermissions = {
  create_organization: false,
  edit_organization: false,
  delete_organization: false,
  create_job: false,
  edit_job: false,
  delete_job: false,
  add_user: false,
  remove_user: false,
  edit_user_permissions: false
};

type IPermissionKey =
  | "create_organization"
  | "edit_organization"
  | "delete_organization"
  | "create_job"
  | "edit_job"
  | "delete_job"
  | "add_user"
  | "remove_user"
  | "edit_user_permissions";

const useGetPermissinons = () => {
  const [permissions, setPermissions] = React.useState<IPermissions>(initialPermissions);
  const { get } = useGetRequest();
  const { match } = useReactRouter();
  const { id } = match.params as { id: string };

  const getUserPermissions = async () => {
    const url = `${config.api}/users/${id}/permissions`;
    const { data, status } = await get(url);
    if (status === 200) {
      setPermissions({ ...initialPermissions, ...data.results });
    }
  };

  const callback = React.useCallback(getUserPermissions, []);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return { permissions, setPermissions };
};

const AccessControls: React.FC = () => {
  const { permissions, setPermissions } = useGetPermissinons();
  const { put } = usePutRequest();
  const { match } = useReactRouter();

  const handleToggle = (key: IPermissionKey) => async () => {
    const { id } = match.params as { id: string };
    const newPermissions = { ...permissions, [key]: !permissions[key] };
    setPermissions(newPermissions);
    const url = `${config.api}/users/${id}/permissions`;
    await put(url, {}, newPermissions);
  };

  return (
    <Card>
      <CardHeader title="Access Control" />
      <Divider />
      <CardContent>
        <List subheader={<ListSubheader>Settings</ListSubheader>}>
          <ListItem divider={true}>
            <ListItemIcon>
              <OrgIcon />
            </ListItemIcon>
            <ListItemText primary="Can CREATE organization" />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                onChange={handleToggle("create_organization")}
                checked={permissions.create_organization}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider={true}>
            <ListItemIcon>
              <OrgIcon />
            </ListItemIcon>
            <ListItemText primary="Can EDIT organization" />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                onChange={handleToggle("edit_organization")}
                checked={permissions.edit_organization}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider={true}>
            <ListItemIcon>
              <OrgIcon />
            </ListItemIcon>
            <ListItemText primary="Can DELETE organization" />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                onChange={handleToggle("delete_organization")}
                checked={permissions.delete_organization}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider={true}>
            <ListItemIcon>
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary="Can CREATE job posting" />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                onChange={handleToggle("create_job")}
                checked={permissions.create_job}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider={true}>
            <ListItemIcon>
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary="Can EDIT job posting" />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                onChange={handleToggle("edit_job")}
                checked={permissions.edit_job}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider={true}>
            <ListItemIcon>
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary="Can DELETE job posting" />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                onChange={handleToggle("delete_job")}
                checked={permissions.delete_job}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider={true}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Can ADD user to organization" />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                onChange={handleToggle("add_user")}
                checked={permissions.add_user}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider={true}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Can REMOVE user from organization" />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                onChange={handleToggle("remove_user")}
                checked={permissions.remove_user}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider={true}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Can EDIT user permissions" />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                onChange={handleToggle("edit_user_permissions")}
                checked={permissions.edit_user_permissions}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default AccessControls;
