import { UserContext } from "@hatech/karma-core/context/user";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import _ from "lodash";
import moment from "moment";
import React from "react";
import { QUERY_CANDIDATE_INTERVIEWS } from "../../../graphql/candidate/interviews";
import { CardPlaceholder, ListPlaceholder } from "../../placeholders";
import { IInterview } from "../../types";

/**
 * A React Functional Component that displays the candidates scheduled interviews
 */

const Interviews: React.FC = () => {
  const user = React.useContext(UserContext);
  const queryInterviews = useApolloQuery(QUERY_CANDIDATE_INTERVIEWS);
  const [interviews, setInterviews] = React.useState<IInterview[]>([]);

  const getInterviews = () => {
    if (user.state) {
      const variables = { applicant: user.state.identity.sub };
      queryInterviews.execute({ variables });
    }
  };
  React.useEffect(getInterviews, [user.state]);

  const setInterviewsState = () => {
    if (
      queryInterviews.data &&
      queryInterviews.data.queryKarmaInterviewsByApplicantJobIndex
    ) {
      const {
        items
      } = queryInterviews.data.queryKarmaInterviewsByApplicantJobIndex;
      const interviewData = items.filter(
        (interview: IInterview) =>
          interview.status && interview.status.toLowerCase() === "accepted"
      );
      setInterviews(interviewData);
    }
  };
  React.useEffect(setInterviewsState, [queryInterviews.data]);

  return (
    <React.Fragment>
      {!queryInterviews.data && (
        <CardPlaceholder content={<ListPlaceholder />} />
      )}
      {queryInterviews.data && (
        <Card>
          <CardHeader title="Interviews" />
          <Divider />
          <CardContent>
            <List>
              {_.isEmpty(interviews) && (
                <ListItem>
                  <ListItemText primary={`You have no upcoming interviews`} />
                </ListItem>
              )}
              {!_.isEmpty(interviews) && (
                <React.Fragment>
                  {interviews.map((interview, index) => {
                    return (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={interview.job && interview.job.title}
                            secondary={moment(
                              interview && interview.datetime
                            ).format("h:mm a on MMMM Do, YYYY")}
                          />
                        </ListItem>
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              )}
            </List>
          </CardContent>
        </Card>
      )}
    </React.Fragment>
  );
};

export default Interviews;
