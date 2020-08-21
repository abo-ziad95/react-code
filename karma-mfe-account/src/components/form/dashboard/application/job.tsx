import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import React from "react";
import { CardPlaceholder } from "../../../placeholders";
import { IApplication, IJob } from "../../../types";

interface IProps {
  application?: IApplication;
  job?: IJob;
}

const Job: React.FC<IProps> = props => {
  return (
    <React.Fragment>
      {!props.application && (
        <CardPlaceholder subheader={true} content={true} />
      )}
      
      {props.application && (
        <Card>
          <CardHeader
            title="Job"
            subheader={props.job && props.job.status}
            style={{ textTransform: "capitalize" }}
          />
          <Divider />
          <CardContent
            dangerouslySetInnerHTML={{
              __html: (props.job && props.job.description) || ""
            }}
          />
        </Card>
      )}
    </React.Fragment>
  );
};

export default Job;
