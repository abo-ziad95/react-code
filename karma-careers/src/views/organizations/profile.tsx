import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import PeopleIcon from "@material-ui/icons/People";
import WorkIcon from "@material-ui/icons/Work";
import * as React from "react";
import Breadcrumbs from "../../components/breadcrumbs";
import Layout from "../../components/layout/index";
import List, { IListItem } from "../../components/list";
import useHistoryPush from "../../hooks/router/useHistoryPush";
import useGetOrganization, {
  IOrganization
} from "../../hooks/useGetOrganization";
import Menu from "./menu";

interface IProps {
  organization: IOrganization;
}
const Actions: React.FC<IProps> = props => {
  const { handleClick } = useHistoryPush();
  const { organization } = props;

  return (
    <React.Fragment>
      <IconButton
        onClick={handleClick(`/organizations/${organization.id}/jobs`)}
      >
        <Tooltip title="View Jobs">
          <WorkIcon />
        </Tooltip>
      </IconButton>
      <IconButton
        onClick={handleClick(`/organizations/${organization.id}/members`)}
      >
        <Tooltip title="View Members">
          <PeopleIcon />
        </Tooltip>
      </IconButton>
      <IconButton
        onClick={handleClick(`/organizations/${organization.id}/edit`)}
      >
        <Tooltip title="Edit Organization">
          <EditIcon color="primary" />
        </Tooltip>
      </IconButton>
    </React.Fragment>
  );
};

const Profile: React.FC = () => {
  const organization = useGetOrganization();
  let profile: IListItem[] = [];
  if (organization) {
    profile = [
      { primary: "Name", secondary: organization.name },
      { primary: "ID", secondary: organization.id }
    ];
  }

  const breadcrumbs = [{ primary: organization ? organization.name : "" }];

  return (
    <Layout
      menuComponent={<Menu />}
      title={organization ? organization.name : undefined}
    >
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="wrapper">
        <Grid container={true} spacing={3} justify="center">
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Card>
              <CardHeader
                title="Organization Details"
                action={organization && <Actions organization={organization} />}
              />
              <Divider />
              <CardContent>
                <List items={profile} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Profile;
