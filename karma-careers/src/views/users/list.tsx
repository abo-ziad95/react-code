import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import * as React from "react";
import Breadcrumbs from "../../components/breadcrumbs";
import Layout from "../../components/layout/index";
import UserList from "../../components/list";
import config from "../../config";
import { IUser } from "../../context/user";
import useGetRequest from "../../hooks/api/useGetRequest";
import useHistoryPush from "../../hooks/router/useHistoryPush";
import Menu from "../organizations/menu";

const useGetUsers = () => {
  const { get } = useGetRequest();
  const [users, setUsers] = React.useState([]);
  const { handleClick } = useHistoryPush();

  const getUsers = async () => {
    const url = `${config.api}/users`;
    const { status, data } = await get(url);
    if (status === 200) {
      setUsers(data.results);
    }
  };

  const callback = React.useCallback(getUsers, []);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return users.map((user: IUser) => {
    return {
      avatar: (
        <Avatar>{user.full_name ? user.full_name.charAt(0) : undefined}</Avatar>
      ),
      primary: user.full_name,
      secondary: user.id,
      handleClick: handleClick(`/users/${user.id}`)
    };
  });
};

const breadcrumbs = [{ primary: "Users" }];

const List: React.FC = () => {
  const users = useGetUsers();
  return (
    <Layout menuComponent={<Menu />} title="Users">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="wrapper">
        <Grid container={true} spacing={3}>
          <Grid item={true} xs={12}>
            <Card>
              <CardHeader title="Users" />
              <Divider />
              <CardContent>
                <UserList items={users} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default List;
