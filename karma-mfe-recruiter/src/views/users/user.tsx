import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import Placeholder from "@hatech/karma-core/components/placeholder";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import React from "react";
import useReactRouter from "use-react-router";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import {GET_USER} from "../../graphql/users";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import _ from 'lodash';

interface IUser {
  [key: string]: any;
}

/**
 * User component returns user info
 */
const User = () => {
  const { match } = useReactRouter();
  const params = match.params as { id: string };
  const userId = params.id;
  const variables = { variables: { id: userId } };
  const query = useApolloQuery(GET_USER);
  const [user, setUser] = React.useState<IUser | undefined>();

  const getUser = () => {
    query.execute(variables);
  };
  React.useEffect(getUser, []);

  const setUserState = () => {
    if (query.data && query.data.getKarmaUserProfiles) {
      setUser(query.data.getKarmaUserProfiles);
    }
  };
  React.useEffect(setUserState, [query.data]);

  const breadcrumbs = [
    {primary: "Users", path: "/users"},
    {primary: query.data ? query.data.getKarmaUserProfiles.full_name : ""}];

  return (
      <div className="wrapper">
        <Grid container={true} spacing={3} justify="center">
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
          </Grid>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Card>
              {_.isUndefined(user) && <CardHeader title={<Placeholder variant="text"/>}/>}
              {user && <CardHeader title={user.full_name}/>}
              <Divider/>
              <CardContent>
                <List>
                  <ListItem divider={true}>
                    <ListItemIcon className={"list-item-first-column"}>
                      <ListItemText primary={"Number:"}/>
                    </ListItemIcon>
                    {_.isUndefined(user) && <ListItemText primary={<Placeholder variant="text"/>}/>}
                    {user && user.phone_number && <ListItemText primary={user.phone_number}/>}
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemIcon className={"list-item-first-column"}>
                      <ListItemText primary={"Email:"}/>
                    </ListItemIcon>
                    {_.isUndefined(user) && <ListItemText primary={<Placeholder variant="text"/>}/>}
                    {user && user.email && <ListItemText primary={user.email}/>}
                  </ListItem>
                  <ListItem divider={true}>
                    <ListItemIcon className={"list-item-first-column"}>
                      <ListItemText primary={"Address:"}/>
                    </ListItemIcon>
                    {_.isUndefined(user) && <ListItemText primary={<Placeholder variant="text"/>}/>}
                    {user && user.addresses && user.addresses[0].address &&
                    <ListItemText primary={user.addresses[0].address}/>}
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
  );
};

export default User;
