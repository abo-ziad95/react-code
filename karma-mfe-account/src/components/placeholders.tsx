import Placeholder from "@hatech/karma-core/components/placeholder";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import React from "react";

interface IPlaceholderProps {
  subheader?: boolean | React.ReactElement;
  content?: boolean |React.ReactElement;
}

export const CardPlaceholder: React.FC<IPlaceholderProps> = props => {
  return (
    <Card>
      <CardHeader
        title={<Placeholder variant="text" width={"100%"} />}
        subheader={
          props.subheader === true ? (
            <Placeholder variant="text" width={"100%"} />
          ) : (
            props.subheader
          )
        }
      />
      <Divider />
      <CardContent>
        {props.content === true ? (
          <Placeholder variant="text" width={"100%"} />
        ) : (
          props.content
        )}
      </CardContent>
    </Card>
  );
};

export const ListPlaceholder: React.FC = () => {
  return (
    <List>
      <ListItem>
        <Placeholder variant="text" width={"100%"} />
      </ListItem>
      <ListItem>
        <Placeholder variant="text" width={"100%"} />
      </ListItem>
      <ListItem>
        <Placeholder variant="text" width={"100%"} />
      </ListItem>
    </List>
  );
};

export const TitlePlaceholder: React.FC = () => {
  return (
    <React.Fragment>
      <Typography variant="h5">
        <Placeholder variant="text" width={"100%"} />
      </Typography>
      <Typography variant="h6">
        <Placeholder variant="text" width={"100%"} />
      </Typography>
    </React.Fragment>
  );
};
