import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Stepper from "@material-ui/core/Stepper";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckIcon from "@material-ui/icons/CheckCircle";
import _ from "lodash";
import React from "react";
import { IApplication, IJob, IStep } from "../../../types";

interface IStepperProps {
  application?: IApplication;
  job?: IJob;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    activeStep: {
      background: theme.palette.primary.main,
      borderRadius: "50%",
      color: theme.palette.primary.contrastText,
      lineHeight: "20px",
      textAlign: "center",
      width: 20
    },
    root: {
      background: "transparent",
      paddingTop: theme.spacing(6)
    },
    step: {
      background: theme.palette.grey.A200,
      borderRadius: "50%",
      color: theme.palette.primary.contrastText,
      lineHeight: "20px",
      textAlign: "center",
      width: 20
    }
  })
);

const StatusStepper: React.FC<IStepperProps> = props => {
  const classes = useStyles({});
  const candidate = props.application;
  const [activeStep, setActiveStep] = React.useState(0);
  const [hiringSteps, setHiringSteps] = React.useState<IStep[]>([]);

  const setStepper = () => {
    if (candidate && candidate.job && candidate.job.hiring_steps) {
      const steps = candidate.job.hiring_steps;
      steps.sort((a: IStep, b: IStep) => a.priority - b.priority);
      const active = _.findIndex(steps, ["label", candidate.status]);
      setActiveStep(active);
      setHiringSteps(steps);
    }
  };
  React.useEffect(setStepper, [candidate]);

  const getIcon = (index: number) => {
    if (index === hiringSteps.length - 1) {
      const color = activeStep === index ? "error" : "disabled";
      return <CancelIcon color={color} />;
    } else if (
      index === 0 ||
      (activeStep > index && activeStep !== hiringSteps.length - 1)
    ) {
      return <CheckIcon color="primary" />;
    } else {
      const className =
        activeStep === index ? classes.activeStep : classes.step;
      return <div className={className}>{index + 1}</div>;
    }
  };

  return (
    <React.Fragment>
      {candidate && candidate.job && candidate.job.hiring_steps && (
        <Stepper
          activeStep={activeStep}
          alternativeLabel={true}
          className={classes.root}
          nonLinear={true}
        >
          {hiringSteps.map((step, index) => (
            <Step key={index}>
              <StepButton disabled={true} icon={getIcon(index)}>
                {step.label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      )}
    </React.Fragment>
  );
};

export default StatusStepper;
