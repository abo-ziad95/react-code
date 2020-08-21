import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import Placeholder from "@hatech/karma-core/components/placeholder";
import useHistoryPush from "@hatech/karma-core/hooks/useHistoryPush";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import _ from "lodash";
import React from "react";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import { GET_USERS_LIST } from "../../graphql/users";

interface IUser {
  [key: string]: string;
}

interface IResults {
  items: IUser[];
  nextToken?: string;
}

interface IQueryResult {
  listKarmaUserProfiles: IResults;
}

interface IFetchMoreOptions {
  fetchMoreResult?: IQueryResult;
  variables?: Record<string, any> | undefined;
}

/**
 * UsersList component return list of users
 */
const UsersList: React.FC = () => {
  const { handleClick } = useHistoryPush();
  const query = useApolloQuery(GET_USERS_LIST);
  const [users, setUsers] = React.useState<IUser[] | undefined>();

  const getUsers = () => {
    query.execute();
  };
  React.useEffect(getUsers, []);

  const setUsersState = () => {
    if (query.data && query.data.listKarmaUserProfiles) {
      setUsers(query.data.listKarmaUserProfiles.items);
    }
  };
  React.useEffect(setUsersState, [query.data]);

  const fetchMore = () => {
    const variables = {
      after: query.data.listKarmaUserProfiles.nextToken
    };

    const updateQuery = (previousQueryResult: IQueryResult, options: IFetchMoreOptions) => {
      if (!options.fetchMoreResult) {
        return previousQueryResult;
      }

      options.fetchMoreResult.listKarmaUserProfiles.items = [
        ...previousQueryResult.listKarmaUserProfiles.items,
        ...options.fetchMoreResult.listKarmaUserProfiles.items
      ];

      return options.fetchMoreResult;
    };
    const fetchMoreOptions = { variables, updateQuery };
    query.fetchMore(fetchMoreOptions);
  };

  const breadcrumbs = [{ primary: "Users" }];

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3} justify="center">
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card>
            <CardHeader title="Users" />
            <Divider />
            <List>
              {_.isUndefined(users) &&
                [1, 2, 3].map(value => (
                  <ListItem key={value} divider={true}>
                    <ListItemText primary={<Placeholder variant="text" />} />
                  </ListItem>
                ))}
              {!_.isUndefined(users) && _.isEmpty(users) && (
                <ListItem>
                  <ListItemText primary="No Users to display" />
                </ListItem>
              )}
              {users &&
                users.map((user: IUser, index: number) => (
                  <ListItem
                    button={true}
                    divider={true}
                    key={index}
                    onClick={handleClick(`/users/${user.id}`)}
                    id={`user-${user.id}`}
                  >
                    <ListItemText primary={user.full_name} secondary={user.status} />
                  </ListItem>
                ))}
            </List>
          </Card>
        </Grid>
        <Grid item={true} style={{ textAlign: "center" }}>
          {query.data && query.data.listKarmaUserProfiles && (
            <Button
              color="primary"
              variant="outlined"
              disabled={!Boolean(query.data.listKarmaUserProfiles.nextToken)}
              onClick={fetchMore}
              id={"load-more"}
            >
              Load More
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default UsersList;
