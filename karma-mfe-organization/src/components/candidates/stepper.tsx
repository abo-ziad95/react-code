import Placeholder from "@hatech/karma-core/components/placeholder";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Stepper from "@material-ui/core/Stepper";
import { createStyles , makeStyles, Theme} from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckIcon from "@material-ui/icons/CheckCircle";
import _ from "lodash";
import React from "react";
import useReactRouter from "use-react-router";
import { GET_CANDIDATE, UPDATE_CANDIDATE } from "../../graphql/candidates";
import { IStep } from "../jobs/droppable";

const useStyles = makeStyles((theme: Theme) => createStyles({
  activeStep: {
    background: theme.palette.primary.main,
    borderRadius: "50%",
    color: theme.palette.primary.contrastText,
    lineHeight: "20px",
    textAlign: "center",
    width: 20,
  },
  root: {
    background: "transparent"
  },
  step: {
    background: theme.palette.grey.A200,
    borderRadius: "50%",
    color: theme.palette.primary.contrastText,
    lineHeight: "20px",
    textAlign: "center",
    width: 20,
  },
}));
/**
 * StatusStepper component renders stepper with candidate status.
 * It perform to change status by clicking to appropriate step.
 * Applies default step in no steps specified at the DB.
 * setStepper function sets hiringSteps, sort them by priority
 * and adds "Denied" step.
 */
const StatusStepper = () => {
  const classes = useStyles();
  const { match } = useReactRouter();
  const params = match.params as { id: string; jobId: string; candidateId: string };
  const candidateId = params.candidateId;
  let steps: IStep[];
  const candidate = useApolloQuery(GET_CANDIDATE);
  const updateCandidate = useApolloMutation(UPDATE_CANDIDATE);
  const [activeStep, setActiveStep] = React.useState(0);
  const [hiringSteps, setHiringSteps] = React.useState<IStep[]>([
    { id: "applied", label: "Applied", priority: 0 },
    { id: "prescreening", label: "Pre-Screened", priority: 1 },
    { id: "interview", label: "Interview", priority: 2 },
    { id: "hired", label: "Hired", priority: 3 },
    { id: "denied", label: "Denied", priority: 4 },
  ]);

  const effect = () => {
    const variables = { variables: { id: candidateId } };
    candidate.execute(variables);
  };
  React.useEffect(effect, []);

  const setStepper = () => {
    if (
      candidate.data &&
      candidate.data.getKarmaCandidates &&
      candidate.data.getKarmaCandidates.job
    ) {
      if (candidate.data.getKarmaCandidates.job.hiring_steps) {
        steps = candidate.data.getKarmaCandidates.job.hiring_steps;
      } else {
        steps = hiringSteps;
      }
      steps.sort((a: IStep, b: IStep) => a.priority - b.priority);
      if (!_.some(steps, {id: "denied", label: "Denied"})) {
        steps.push({id: "denied", label: "Denied", priority: steps[steps.length - 1].priority + 1});
      }
      const active = _.findIndex(steps, ["label", candidate.data.getKarmaCandidates.status]);
      setActiveStep(active >= 0 ? active : 0);
      setHiringSteps(steps);
    }
  };
  React.useEffect(setStepper, [candidate.data]);

  const handleClick = (index: number) => () => {
    const input = {
      id: candidate.data.getKarmaCandidates.id,
      status: hiringSteps[index].label
    };
    const variables = { input };
    updateCandidate.execute({ variables });
    setActiveStep(index);
  };

  const isDisabled = (index: number) => {
    if (index === activeStep) {
      return true;
    } else if (index === 0 && activeStep === hiringSteps.length - 1) {
      return false;
    } else if (index === hiringSteps.length - 1) {
      return false;
    } else if (activeStep === hiringSteps.length - 1) {
      return true;
    } else if (index < activeStep - 1 || index > activeStep + 1) {
      return true;
    }
  };

  const getIcon = (index: number) => {
    if (index === hiringSteps.length - 1) {
      const color = activeStep === index ? "error" : "disabled";
      return <CancelIcon color={color} />;
    } else if (index === 0 || (activeStep > index && activeStep !== hiringSteps.length - 1)) {
      return <CheckIcon color="primary" />;
    } else {
      const className = activeStep === index ? classes.activeStep : classes.step;
      const value = activeStep === index ? "active" : "inactive";
      return (
        <div className={className}>
          <input type={"hidden"} value={value}/>
          {index + 1}
        </div>
      );
    }
  };

  return (
    <div>
      {candidate && candidate.loading && <Placeholder variant={"rect"}/>}
      {candidate && !candidate.loading && (
        <Stepper
          activeStep={activeStep}
          alternativeLabel={true}
          className={classes.root}
          nonLinear={true}
          id="stepper"
        >
          {hiringSteps.map((step, index) => (
            <Step key={index}>
              <StepButton
                disabled={isDisabled(index)}
                onClick={handleClick(index)}
                icon={getIcon(index)}
              >
                {step.label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      )}
    </div>
  );
};

export default StatusStepper;
