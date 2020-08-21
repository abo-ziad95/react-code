import { NotificationContext } from "@hatech/karma-core/context/notifications";
import { UserContext } from "@hatech/karma-core/context/user";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import useTextField from "@hatech/karma-core/hooks/useTextField";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import { Storage } from "aws-amplify";
import moment from "moment";
import React from "react";
import uuid from "uuid";
import { ProfileContext } from "../../../../context/profile";
import { CREATE_CANDIDATE_RESUME, DELETE_CANDIDATE_RESUME, QUERY_CANDIDATE_RESUMES } from "../../../../graphql/candidate/resume";
import { CardPlaceholder, ListPlaceholder } from "../../../placeholders";
import { IResume } from "../../../types";
import ResumeList from "./list";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      paddingTop: theme.spacing(1)
    }
  })
);

/**
 * A React Functional Component that displays the candidates saved resumes
 */

const Resume: React.FC = () => {
  const notifications = React.useContext(NotificationContext);
  const classes = useStyles();
  const createResume = useApolloMutation(CREATE_CANDIDATE_RESUME);
  const deleteResume = useApolloMutation(DELETE_CANDIDATE_RESUME);
  const profile = React.useContext(ProfileContext);
  const queryResumes = useApolloQuery(QUERY_CANDIDATE_RESUMES);
  const upload = useTextField("upload", "Upload Your Resume");
  const user = React.useContext(UserContext);
  const [open, setOpen] = React.useState(false);
  const [resume, setResume] = React.useState<IResume>();
  const [resumes, setResumes] = React.useState<IResume[]>([]);

  const getResumes = () => {
    if (user.state) {
      const variables = { user: user.state.identity.sub };
      queryResumes.execute({ variables });
    }
  };
  React.useEffect(getResumes, [user.state]);

  const setResumesState = () => {
    const resumeData =
      queryResumes.data &&
      queryResumes.data.queryKarmaUploadsByUserDateCreatedIndex;
    if (resumeData) {
      setResumes(resumeData.items);
    }
  };
  React.useEffect(setResumesState, [queryResumes.data]);

  const createMutationEffect = () => {
    if (createResume.data) {
      handleNotifications("Resume Uploaded");
    } 
  };
  React.useEffect(createMutationEffect, [createResume.data]);

  const deleteMutationEffect = () => {
    if (deleteResume.data) {
      handleNotifications("Resume Deleted");
    }
  };
  React.useEffect(deleteMutationEffect, [deleteResume.data]);

  const handleNotifications = (message: any) => {
    notifications.dispatch({
      payload: {
        message
      },
      type: "ADD_NOTIFICATION"
    });
  };

  const handleOpen = (resumeData?: IResume) => (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!resumeData) {
      return;
    }
    setResume(resumeData);
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user.state || !upload.files) {
      return;
    }
    const file = upload.files[0];
    const id = uuid.v4();
    const extension = file.name.split(".").pop();
    const input = {
      date_created: moment().format("YYYY-MM-DD"),
      file: id + "." + extension,
      id,
      name: file.name,
      user: user.state.identity.sub
    };
    const variables = { input };
    setResumes([...resumes, input]);
    const config = {
      contentType: file.type
    };
    await Storage.put(input.file, file, config);
    createResume.execute({ variables });
    upload.setValue("");
  };

  const handleDelete = (resumeId?: string) => async (
    event: React.MouseEvent
  ) => {
    if (!resumeId) {
      return;
    }
    setResumes(resumes.filter(res => res.id !== resumeId));
    handleClose();
    const removed = resumes.filter(res => res.id === resumeId);
    await Storage.remove(removed[0].file as string);
    const variables = { input: { id: resumeId } };
    deleteResume.execute({ variables });
  };

  return (
    <React.Fragment>
      {!profile.state && <CardPlaceholder content={<ListPlaceholder />} />}
      {profile.state && (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader title="Resume" />
            <Divider />
            <CardContent>
              <ResumeList
                handleClose={handleClose}
                handleDelete={handleDelete}
                handleOpen={handleOpen}
                open={open}
                resume={resume}
                resumes={resumes}
              />
              <TextField
                {...upload.attributes}
                type="file"
                InputLabelProps={{
                  shrink: true
                }}
              />
              <Button
                className={classes.button}
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

export default Resume;
