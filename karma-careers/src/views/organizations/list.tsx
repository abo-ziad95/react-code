import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";
import * as React from "react";
import Breadcrumbs from "../../components/breadcrumbs";
import Layout from "../../components/layout/index";
import OrganizationList from "../../components/list";
import useGetRequest from "../../hooks/api/useGetRequest";
import useHistoryPush from "../../hooks/router/useHistoryPush";
import { IOrganization } from "../../hooks/useGetOrganization";
import Menu from "./menu";

const useGetOrganizations = () => {
  const { get } = useGetRequest();
  const [organizations, setOrganizations] = React.useState([]);
  const { handleClick } = useHistoryPush();

  const getOrganizations = async () => {
    const url = `https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/organizations`;
    const { data, status } = await get(url);
    if (status === 200) {
      setOrganizations(data.results);
    }
  };

  const callback = React.useCallback(getOrganizations, []);
  React.useEffect(() => {
    callback();
  }, [callback]);

  return organizations.map((organization: IOrganization) => {
    return {
      avatar: (
        <Avatar>
          {organization.name ? organization.name.charAt(0) : undefined}
        </Avatar>
      ),
      primary: organization.name,
      secondary: organization.id,
      handleClick: handleClick(`/organizations/${organization.id}`)
    };
  });
};

const breadcrumbs = [{ primary: "Organizations" }];

const List: React.FC = () => {
  const organizations = useGetOrganizations();
  const { handleClick } = useHistoryPush();

  return (
    <Layout menuComponent={<Menu />} title="Organizations">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="wrapper">
        <Grid container={true} spacing={3}>
          <Grid item={true} xs={12}>
            <Card>
              <CardHeader
                title="Organizations"
                action={
                  <Button onClick={handleClick("/organizations/create")}>
                    <AddIcon color="primary" /> Organization
                  </Button>
                }
              />
              <Divider />
              <CardContent>
                <OrganizationList items={organizations} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default List;
