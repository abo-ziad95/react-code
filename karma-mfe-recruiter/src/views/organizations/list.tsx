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
import {IconButton} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Add";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import {GET_ORGANIZATIONS_LIST} from "../../graphql/organisationsList";

interface IOrganization {
  [key: string]: string;
}

interface IResults {
  items: IOrganization[];
  nextToken?: string;
}

interface IQueryResult {
  listKarmaOrganizations: IResults;
}

interface IFetchMoreOptions {
  fetchMoreResult?: IQueryResult;
  variables?: Record<string, any> | undefined;
}

/**
 * Actions component return icon button with link
 */
const Actions: React.FC = () => {
  const { handleClick } = useHistoryPush();

  return (
      <React.Fragment>
        <IconButton onClick={handleClick(`/organizations/create`)} id={"create-organization"}>
          <Tooltip title="Create Organization">
            <EditIcon color="primary" />
          </Tooltip>
        </IconButton>
      </React.Fragment>
  );
};

/**
 * OrganizationsList component return list of organizations
 */
const OrganizationsList: React.FC = () => {
  let actions = <Placeholder variant="circle" height={48} width={48} style={{marginLeft: 12}}/>;
  const { handleClick } = useHistoryPush();
  const query = useApolloQuery(GET_ORGANIZATIONS_LIST);
  const [organizations, setOrganizations] = React.useState<IOrganization[] | undefined>();

  const getOrganizations = () => {
    query.execute();
  };
  React.useEffect(getOrganizations, []);

  const setOrganizationsState = () => {
    if(query.data && query.data.listKarmaOrganizations){
      setOrganizations(query.data.listKarmaOrganizations.items);
    }
  };
  React.useEffect(setOrganizationsState, [query.data]);

  const fetchMore = () => {
    const variables = {
      after: query.data.listKarmaOrganizations.nextToken
    };

    const updateQuery = (previousQueryResult: IQueryResult, options: IFetchMoreOptions) => {
      if (!options.fetchMoreResult) {
        return previousQueryResult;
      }

      options.fetchMoreResult.listKarmaOrganizations.items = [
        ...previousQueryResult.listKarmaOrganizations.items,
        ...options.fetchMoreResult.listKarmaOrganizations.items
      ];

      return options.fetchMoreResult;
    };

    const fetchMoreOptions = { variables, updateQuery };
    query.fetchMore(fetchMoreOptions);
  };

  const breadcrumbs = [{ primary: "Organizations" }];
  if (!_.isEmpty(organizations)) {
    actions = <Actions/>;
  }


  return (
    <div className="wrapper">
      <Grid container={true} spacing={3} justify="center">
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card>
            <CardHeader title="Organizations" action={actions}/>
            <Divider />
            <List>
              {_.isUndefined(organizations) &&
                [1, 2, 3].map(value => (
                  <ListItem key={value} divider={true}>
                    <ListItemText primary={<Placeholder variant="text" />} />
                  </ListItem>
                ))}
              {_.isNull(organizations) && (
                <ListItem>
                  <ListItemText primary="No organizations to display" />
                </ListItem>
              )}
              {organizations && organizations.map((organization: IOrganization, index: number) => (
                  <ListItem
                    button={true}
                    divider={true}
                    key={index}
                    onClick={handleClick(`/organizations/${organization.id}`)}
                    id={`organization-${organization.id}`}
                  >
                    <ListItemText primary={organization.name} />
                  </ListItem>
                ))}
            </List>
          </Card>
        </Grid>
        <Grid item={true} style={{ textAlign: "center" }}>
          {query.data && query.data.listKarmaOrganizations &&
            <Button
                color="primary"
                variant="outlined"
                disabled={!Boolean(query.data.listKarmaOrganizations.nextToken)}
                onClick={fetchMore}
                id={"load-more"}
            >
              Load More
            </Button>
          }
        </Grid>
      </Grid>
    </div>
  );
};

export default OrganizationsList;
