import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import * as React from "react";
import useReactRouter from "use-react-router";
import Breadcrumbs from "../../components/breadcrumbs";
import Layout from "../../components/layout/index";
import List, { IListItem } from "../../components/list";
import Menu from "../organizations/menu";
import config from "../../config";
import { IUser } from "../../context/user";
import useGetRequest from "../../hooks/api/useGetRequest";
import AccessControls from "./accessControls";
import GroupsControls from "./groupsControls";
import StatusControls from "./statusControls";

const useGetUser = () => {
  const { get } = useGetRequest();
  const [user, setUser] = React.useState<IUser>();
  const { match } = useReactRouter();
  const { id } = match.params as { id: string };

  const getUsers = async () => {
    const url = `${config.api}/users/${id}`;
    const { data, status } = await get(url);
    if (status === 200) {
      setUser(data.results);
    }
  };

  const callback = React.useCallback(getUsers, []);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return user;
};

const Profile: React.FC = () => {
  const user = useGetUser();

  let profile: IListItem[] = [];
  if (user) {
    profile = [
      { primary: "First Name", secondary: user.given_name },
      { primary: "Last Name", secondary: user.family_name },
      { primary: "ID", secondary: user.id }
    ];
  }

  const breadcrumbs = [
    { primary: "Users", path: "/users" },
    { primary: user ? user.full_name : "" }
  ];

  return (
    <Layout menuComponent={<Menu />} title={user ? user.full_name : undefined}>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="wrapper">
        <Grid container={true} spacing={3} justify="center">
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Card>
              <CardHeader title="Profile" />
              <Divider />
              <CardContent>
                <List items={profile} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <StatusControls />
          </Grid>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <GroupsControls />
          </Grid>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <AccessControls />
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Profile;
