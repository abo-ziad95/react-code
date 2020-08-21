import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import Placeholder from "@hatech/karma-core/components/placeholder";
import {NotificationContext} from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import Divider from "@material-ui/core/Divider/Divider";
import Grid from "@material-ui/core/Grid/Grid";
import IconButton from "@material-ui/core/IconButton/IconButton";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import CancelIcon from "@material-ui/icons/Cancel";
import _ from "lodash";
import moment from "moment";
import React, { useState } from "react";
import Calendar, { CalendarTileProperties } from "react-calendar";
import { IInterview } from "../../components/candidates/types";
import { OrganizationContext } from "../../context/organization";
import { GET_INTERVIEWS, UPDATE_INTERVIEW } from "../../graphql/interviews";
/**
 * CalendarView component returns calendar to show interviews for each date
 */
const CalendarView = () => {
  const interviewsQuery = useApolloQuery(GET_INTERVIEWS);
  const organization = React.useContext(OrganizationContext);
  const [interviews, setInterviews] = useState<IInterview[] | undefined>();
  const mutation = useApolloMutation(UPDATE_INTERVIEW);
  const [date, setDate] = React.useState(new Date());
  const [showDates, setShowDates] = React.useState(false);
  const [clickOnMonth, setClickOnMonth] = React.useState(false);
  const [interviewsDates, setInterviewsDates] = React.useState<string[]>([]);
  const notification = React.useContext(NotificationContext);

  const setInterviewsState = () => {
    if (interviewsQuery.data && interviewsQuery.data.listKarmaInterviews) {
      if(!interviewsDates.length){
        const validInterviewsDates:string[] = [];
        interviewsQuery.data.listKarmaInterviews.items.forEach((item:IInterview) => {
          validInterviewsDates.push(moment(item.datetime).format("YYYY-MM-DD"))
        });
        setInterviewsDates(validInterviewsDates);
      }
      let datesToShow = false;
      const listKarmaInterviews:IInterview[] = [];
      const element:HTMLButtonElement | null = document.querySelector('.react-calendar__tile--active');
      interviewsQuery.data.listKarmaInterviews.items.forEach((interview:IInterview) => {
        if(moment().format('YYYY-MM-DD')
          ===
          moment(interview.datetime).format('YYYY-MM-DD')){
          datesToShow = true;
          listKarmaInterviews.push(interview);
        }
      });
      setShowDates(datesToShow);
      if(listKarmaInterviews.length && datesToShow) { setInterviews(listKarmaInterviews); }
      else if(element && Boolean(element.disabled)) { setInterviews(listKarmaInterviews); }
      else { setInterviews(interviewsQuery.data.listKarmaInterviews.items) }
    }

  };
  React.useEffect(setInterviewsState, [interviewsQuery.data]);


  const getInterviews = () => {
    if (!organization.state) {
      return;
    }
    const startDate = moment(date).format("YYYY-MM-01T00:00");
    const endDate = moment(date).format("YYYY-MM-31T23:59");

    const variables = {
      filter: {
        datetime: { between: [startDate, endDate] },
        organization: { eq: organization.state.id },
        status: { notContains: 'deleted' },
      }
    };
    interviewsQuery.execute({ variables });

  };
  React.useEffect(getInterviews, [organization.state]);

  const handleChange = (newDate: Date | Date[]) => {
    if (!organization.state || _.isArray(newDate)) {
      return;
    }

    setDate(newDate);
    const startDate = moment(newDate).format("YYYY-MM-DDT00:00");
    const endDate = moment(newDate).format("YYYY-MM-DDT23:59");
    const options = {
      variables: {
        filter: {
          datetime: { between: [startDate, endDate] },
          organization: { eq: organization.state.id },
          status: { notContains: 'deleted' },
        }
      }
    };
    setShowDates(true);
    setClickOnMonth(false);
    interviewsQuery.execute(options);
  };

  const handleDelete = (id: string) => async () => {
    const input = { id, status: 'deleted' };
    const variables = { input };
    const {data} = await mutation.execute({ variables });
    if (data) {
      notification.dispatch({
        payload: {
          message: "Interview has been deleted"
        },
        type: "ADD_NOTIFICATION",
      });
    }
  };

  /**
   * Determine which dates have interviews on them
   */

  const tileDisabled = ({ date: checkDate }: CalendarTileProperties) =>
    (!interviewsDates.includes(moment(checkDate).format("YYYY-MM-DD")));

  const breadcrumbs = [
    { primary: organization.state ? organization.state.name : "", path: "/" },
    { primary: "Calendar" }
  ];

  const getInterviewsByMonth = (month: any) => {
    let interviewDate = JSON.parse(JSON.stringify(month));
    if (month.activeStartDate) { interviewDate = month.activeStartDate; }
    const startDate = moment(interviewDate).format("YYYY-MM-01T00:00");
    const endDate = moment(interviewDate).format("YYYY-MM-31T23:59");
    if (organization.state) {
      const options = {
        variables: {
          filter: {
            datetime: { between: [startDate, endDate] },
            organization: { eq: organization.state.id },
            status: { notContains: 'deleted' },
          }
        }
      };
      setClickOnMonth(true);
      setShowDates(false);
      setInterviewsDates([]);
      interviewsQuery.execute(options);
      const element = document.querySelector('.react-calendar__tile--active');
      if(element) { element.classList.remove('react-calendar__tile--active') }
    }
  };

  return (
    <div className="wrapper">
      <Grid container={true} spacing={3} justify="center">
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Calendar
              onClickMonth={getInterviewsByMonth}
              onActiveDateChange={getInterviewsByMonth}
              onChange={handleChange}
              value={date}
              tileDisabled={tileDisabled}
              className={clickOnMonth ? 'clearActiveDay' : ''}
            />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card style={{ marginTop: "15px" }}>
            <CardHeader title="Interview Schedule" />
            <Divider />
            <CardContent>
              <List>
                {_.isUndefined(interviews) &&
                  [1, 2, 3].map(value => (
                    <ListItem key={value} divider={true}>
                      <ListItemText primary={<Placeholder variant="text" />} />
                    </ListItem>
                  ))}
                {!_.isUndefined(interviews) && !interviews.length && !showDates && !clickOnMonth && (
                  <ListItem>
                    <ListItemText primary="No interviews scheduled" />
                  </ListItem>
                )}
                {interviews && clickOnMonth && (
                  <ListItem>
                    <ListItemText primary="No interviews scheduled" />
                  </ListItem>
                )}
                {!clickOnMonth && interviews &&
                  interviews.map((interview, index) => (
                      <ListItem key={index} divider={true}>
                        {interview && interview.applicant && (
                          <ListItemText
                            primary={interview.applicant.applicant.full_name}
                            secondary={interview.job.title}
                          />
                        )}
                        <ListItemText
                          primary={moment(interview.datetime).format("MMMM DD, YYYY @ HH:mm")}
                          secondary={interview.status}
                        />
                        <IconButton id="cancel" onClick={handleDelete(interview.id)}>
                          <CancelIcon />
                        </IconButton>
                      </ListItem>
                      )
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default CalendarView;
