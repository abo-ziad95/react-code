import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import React from "react";
import { CardPlaceholder, ListPlaceholder } from "../../../placeholders";
import { IApplication, IInterview } from "../../../types";
import Available from "./avaiable";
import Scheduled from "./scheduled";

interface IProps {
  application?: IApplication;
  interviews?: IInterview[];
}

const Interviews: React.FC<IProps> = props => {
  return (
    <React.Fragment>
      {!props.application && <CardPlaceholder content={<ListPlaceholder />} />}
      
      {props.application && (
        <Card>
          <CardHeader title="Interviews" />
          <Divider />
          <CardContent>
            <Scheduled
              application={props.application}
              interviews={props.interviews}
            />
            <Available
              application={props.application}
              interviews={props.interviews}
            />
          </CardContent>
        </Card>
      )}
    </React.Fragment>
  );
};

export default Interviews;
