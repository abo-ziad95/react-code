import { NotificationContext } from "@hatech/karma-core/context/notifications";
import { UserContext } from "@hatech/karma-core/context/user";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import React from "react";
import { ProfileContext } from "../../../context/profile";
import { CREATE_CANDIDATE_PROFILE, UPDATE_CANDIDATE_PROFILE } from "../../../graphql/candidate/profile";
import { CardPlaceholder, ListPlaceholder } from "../../placeholders";
import MultipleSelect from "../../reusable/select/multiple";
import SingleSelect from "../../reusable/select/single";
import { suggestions } from "../../reusable/select/suggestions";
import { useStyles } from "../../reusable/select/textField";
import { ICandidate } from "../../types";

interface ICriteria {
  candidate: ICandidate;
}

/**
 * A React Functional Component form that allows a candidate to input search criteria
 * It contains autocomplete functionality that helps a user fill out the form
 */

const Criteria: React.FC<ICriteria> = props => {
  const notifications = React.useContext(NotificationContext);
  const user = React.useContext(UserContext);
  const profile = React.useContext(ProfileContext);
  const updateCandidate = useApolloMutation(UPDATE_CANDIDATE_PROFILE);
  const createCandidate = useApolloMutation(CREATE_CANDIDATE_PROFILE);
  const classes = useStyles({});

  const [datePosted, setDatePosted] = React.useState();
  const [education, setEducation] = React.useState();
  const [experience, setExperience] = React.useState();
  const [salaryRange, setSalaryRange] = React.useState();

  const [keywords, setKeywords] = React.useState<string[]>([]);
  const [industries, setIndustries] = React.useState<string[]>([]);
  const [jobTypes, setJobTypes] = React.useState<string[]>([]);

  const setCandidateState = () => {
    const candidate = props.candidate;
    if (candidate) {
      setDatePosted(props.candidate.date_posted);
      setEducation(props.candidate.education);
      setExperience(props.candidate.experience);
      setSalaryRange(props.candidate.salary_range);
      setIndustries(props.candidate.industries);
      setKeywords(props.candidate.keywords);
      setJobTypes(props.candidate.job_type);
    }
  };
  React.useEffect(setCandidateState, [props.candidate]);

  const mutationEffect = () => {
    if (createCandidate.data) {
      handleNotifications("Profile Created");
    } else if (updateCandidate.data) {
      handleNotifications("Profile Updated");
    }
  };
  React.useEffect(mutationEffect, [createCandidate.data, updateCandidate.data]);

  const handleNotifications = (message: any) => {
    notifications.dispatch({
      payload: {
        message
      },
      type: "ADD_NOTIFICATION"
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user.state) {
      return;
    }
    const input = {
      date_posted: datePosted || undefined,
      education: education || undefined,
      experience: experience || undefined,
      id: user.state.identity.sub,
      industries: industries || [],
      job_type: jobTypes || [],
      keywords: keywords || [],
      salary_range: salaryRange || undefined
    };
    const variables = { input };
    if (props.candidate && props.candidate.id) {
      updateCandidate.execute({ variables });
    } else {
      createCandidate.execute({ variables });
    }
  };

  return (
    <React.Fragment>
      {!profile.state && <CardPlaceholder content={<ListPlaceholder />} />}
      {profile.state && (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader title="Search Criteria" />
            <Divider />
            <CardContent>
              <MultipleSelect
                fields={keywords}
                label="Keywords"
                test="keyword-input"
                setFields={setKeywords}
              />
              <MultipleSelect
                fields={industries}
                label="Industries"
                test="industries-input"
                setFields={setIndustries}
                suggestions={suggestions.industries}
              />
              <MultipleSelect
                fields={jobTypes}
                label="Job Type"
                test="job-type-input"
                setFields={setJobTypes}
                suggestions={suggestions.jobTypes}
              />
              <SingleSelect
                field={education}
                label="Education"
                test="education-input"
                setField={setEducation}
                suggestions={suggestions.education}
              />
              <SingleSelect
                field={experience}
                label="Experience"
                test="experience-input"
                setField={setExperience}
                suggestions={suggestions.experience}
              />
              <SingleSelect
                field={salaryRange}
                label="Salary Range"
                test="salary-range-input"
                setField={setSalaryRange}
                suggestions={suggestions.salaryRange}
              />
              <SingleSelect
                field={datePosted}
                label="Date Posted"
                test="date-posted-input"
                setField={setDatePosted}
                suggestions={suggestions.datePosted}
              />
              <Button
                className={classes.button}
                data-test="criteria-submit"
                onClick={handleSubmit}
                color="primary"
                size="medium"
                type="submit"
                variant="contained"
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </form>
      )}
    </React.Fragment>
  );
};

export default Criteria;
