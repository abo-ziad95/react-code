import Placeholder from "@hatech/karma-core/components/placeholder";
import { AlertsContext } from "@hatech/karma-core/context/alerts";
import IconButton from "@material-ui/core/IconButton";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import { Storage } from "aws-amplify";
import React from "react";
import { CandidateContext } from "../../context/candidate";

/**
 * Resume component renders button to download Resume
 */

const Resume: React.FC = () => {
  const alerts = React.useContext(AlertsContext);
  const candidate = React.useContext(CandidateContext);

  const handleClick = async () => {
    if (!candidate.state || !candidate.state.resume) {
      alerts.dispatch({
        payload: {
          body: "Candidate does not have a resume to download"
        },
        type: "ADD_ALERT"
      });
      return;
    }



    const file = await Storage.get(candidate.state.resume.file);
    window.open(
      file as string,
      "_blank" // <- This is what makes it open in a new window.
    );
  };

  if (!candidate.state) {
    return <Placeholder variant="circle" width={48} height={48} />;
  }

  return (
    <IconButton
      id="downloadBtn"
      color="primary"
      onClick={handleClick}
      disabled={!Boolean(candidate.state.resume)}
    >
      <DownloadIcon />
    </IconButton>
  );
};

export default Resume;
