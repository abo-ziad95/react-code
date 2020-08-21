import useTextField from "@hatech/karma-core/hooks/useTextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import React from "react";
import uuid from "uuid";
import { IStep } from "./droppable";

interface IProps {
  hiringSteps: IStep[];
  setHiringSteps: React.Dispatch<React.SetStateAction<IStep[]>>;
}


/**
 * AddHiringStep component added step to candidate Hiring steps.
 */

const AddHiringStep: React.FC<IProps> = props => {
  const [open, setOpen] = React.useState(false);
  const step = useTextField("step", "Define New Step");

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSubmit = () => {
    handleClose();
    if (!step.value) {
      return;
    }

    const steps = props.hiringSteps;
    steps.push({
      id: uuid.v4(),
      label: step.value,
      priority: props.hiringSteps.length
    });
    props.setHiringSteps([...steps]);
  };

  return (
    <React.Fragment>
      <Button id="addStep" color="primary" onClick={handleOpen} size="small">
        Add Step
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <TextField {...step.attributes} autoFocus={true} />
        </DialogContent>
        <DialogActions>
          <Button id="addStepSubmit" onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AddHiringStep;
