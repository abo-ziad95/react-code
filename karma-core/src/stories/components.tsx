import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import { storiesOf } from "@storybook/react";
import React from "react";
import Karma from "..";
import Alerts from "../components/alerts";
import Breadcrumbs from "../components/breadcrumbs";
import MuiDialog from "../components/dialog";
import Notifications from "../components/notifications";
import Placeholder from "../components/placeholder";
import { MockAlert, MockNotification } from "./mock";

const parameters = {
  info: {
    inline: true,
    styles: {
      header: {
        h1: {
          color: "#232323"
        }
      }
    }
  },
  propTablesExclude: [Karma, MockAlert, MockNotification, React.Fragment]
};

const stories = storiesOf("Components", module);

stories.addParameters(parameters);

stories.addDecorator(storyFn => <Karma>{storyFn()}</Karma>);

stories.add("Alert", () => {
  return (
    <div>
      <MockAlert />
      <Alerts />
    </div>
  );
});

stories.add("Breadcrumbs", () => {
  const breadcrumbs = [
    {
      path: "https://www.google.com/",
      primary: "Google"
    },
    {
      path: "https://www.google.com/search?q=material-ui",
      primary: "Material-UI"
    },
    {
      primary: "Breadcrumbs"
    }
  ];
  return (
    <Card>
      <CardContent style={{ paddingBottom: 16 }}>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </CardContent>
    </Card>
  );
});

stories.add("Dialog", () => <MuiDialog title="Some Title" body="Some Content" open={true} />);

stories.add("Notification", () => {
  return (
    <div>
      <MockNotification />
      <Notifications />
    </div>
  );
});

stories.add("Placeholder", () => (
  <Card>
    <CardHeader
      avatar={<Placeholder variant="circle" width="40px" height="40px" />}
      title={<Placeholder variant="text" />}
    />
    <Divider />
    <CardContent>
      <Placeholder variant="text" />
      <Placeholder variant="text" width="80%" />
    </CardContent>
  </Card>
));
