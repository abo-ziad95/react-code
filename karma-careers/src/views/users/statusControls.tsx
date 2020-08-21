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
import ActiveIcon from "@material-ui/icons/PersonPin";
import * as React from "react";
import useReactRouter from "use-react-router";
import config from "../../config";
import useGetRequest from "../../hooks/api/useGetRequest";
import usePutRequest from "../../hooks/api/usePutRequest";

const useGetUserStatus = () => {
  const { get } = useGetRequest();
  const { put } = usePutRequest();
  const [enabled, setEnabled] = React.useState(false);
  const { match } = useReactRouter();
  const { id } = match.params as { id: string };

  const updateStatus = async () => {
    const { id } = match.params as { id: string };
    setEnabled(!enabled);
    const url = `${config.api}/users/${id}/status`;
    await put(url, {}, { enabled: !enabled });
  };

  const getStatus = async () => {
    const url = `${config.api}/users/${id}/status`;
    const { data, status } = await get(url);
    if (status === 200) {
      setEnabled(data.results.enabled);
    }
  };

  const callback = React.useCallback(getStatus, []);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return { enabled, updateStatus };
};

const StatusControls: React.FC = () => {
  const status = useGetUserStatus();

  const handleStatusChange = () => {
    status.updateStatus();
  };

  return (
    <Card>
      <CardHeader title="Status" />
      <Divider />
      <CardContent>
        <List subheader={<ListSubheader>Current Status</ListSubheader>}>
          <ListItem divider={true}>
            <ListItemIcon>
              <ActiveIcon />
            </ListItemIcon>
            <ListItemText primary="Active" />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                onChange={handleStatusChange}
                checked={status.enabled}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default StatusControls;
