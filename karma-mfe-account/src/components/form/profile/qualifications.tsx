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
import { TextFields, useStyles } from "../../reusable/select/textField";

interface IData {
  [key: string]: any;
}

interface IQualifications {
  candidate: IData;
}

interface IFields {
  certifications?: string;
  languages?: string;
  skills?: string;
}

/**
 * A React Functional Component form that allows a candidate to input their qualifications
 */

const Qualifications: React.FC<IQualifications> = props => {
  const classes = useStyles();
  const notifications = React.useContext(NotificationContext);
  const profile = React.useContext(ProfileContext);
  const user = React.useContext(UserContext);
  const createCandidate = useApolloMutation(CREATE_CANDIDATE_PROFILE);
  const updateCandidate = useApolloMutation(UPDATE_CANDIDATE_PROFILE);
  const [fields, setFields] = React.useState<IFields>({
    certifications: undefined,
    languages: undefined,
    skills: undefined
  });
  const [certifications, setCertifications] = React.useState<string[]>([]);
  const [languages, setLanguages] = React.useState<string[]>([]);
  const [skills, setSkills] = React.useState<string[]>([]);

  const setCandidateState = () => {
    if (props.candidate) {
      setCertifications(props.candidate.certifications);
      setLanguages(props.candidate.languages);
      setSkills(props.candidate.skills);
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
      certifications: certifications || [],
      id: user.state.identity.sub,
      languages: languages || [],
      skills: skills || []
    };
    const variables = { input };
    if (props.candidate && props.candidate.id) {
      updateCandidate.execute({ variables });
    } else {
      createCandidate.execute({ variables });
    }
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      return;
    }
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  const handleChipItems = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.name) {
      return;
    }
    const newFields = fields;
    switch (event.target.name) {
      case "skills":
        if (event.target.value !== "") {
          skills.push(event.target.value);
          setSkills([...skills]);
          newFields.skills = undefined;
        }
        break;
      case "languages":
        if (event.target.value !== "") {
          languages.push(event.target.value);
          setLanguages([...languages]);
          newFields.languages = undefined;
        }
        break;
      case "certifications":
        if (event.target.value !== "") {
          certifications.push(event.target.value);
          setCertifications([...certifications]);
          newFields.certifications = undefined;
        }
        break;
    }
    setFields(newFields);
  };

  const handleChipDelete = (array: string[], deletedItem: string) => (
    event: React.MouseEvent
  ) => {
    if (!array || !deletedItem) {
      return;
    }
    const filteredArray = array.filter((item: string) => item !== deletedItem);
    switch (array) {
      case certifications:
        setCertifications(filteredArray);
        break;
      case languages:
        setLanguages(filteredArray);
        break;
      case skills:
        setSkills(filteredArray);
        break;
    }
  };

  return (
    <React.Fragment>
      {!profile.state && <CardPlaceholder content={<ListPlaceholder />} />}
      {profile.state && (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader title="Qualifications" />
            <Divider />
            <CardContent>
              <TextFields
                handleChipDelete={handleChipDelete}
                handleChipItems={handleChipItems}
                handleFieldChange={handleFieldChange}
                items={certifications}
                label="Certifications"
                name="certifications"
                placeholder="AWS Developer Associate or CCNA e.g."
                test={"certifications-input"}
                value={fields.certifications}
              />
              <TextFields
                handleChipDelete={handleChipDelete}
                handleChipItems={handleChipItems}
                handleFieldChange={handleFieldChange}
                items={languages}
                label="Languages"
                name="languages"
                placeholder="Spanish or Mandarin e.g."
                test={"languages-input"}
                value={fields.languages}
              />
              <TextFields
                handleChipDelete={handleChipDelete}
                handleChipItems={handleChipItems}
                handleFieldChange={handleFieldChange}
                items={skills}
                label="Skills"
                name="skills"
                placeholder="Cloud Computing or Communication e.g."
                test={"skills-input"}
                value={fields.skills}
              />
              <Button
                className={classes.button}
                data-test="qualifications-submit"
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

export default Qualifications;
