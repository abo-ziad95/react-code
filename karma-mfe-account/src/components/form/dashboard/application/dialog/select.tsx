import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import moment from "moment";
import React from "react";
import { IInterview } from "../../../../types";

interface IDialog {
  interviews?: IInterview[];
  open: boolean;
  value: any;
  handleClose: () => void;
  handleSelectedTime: (event: React.ChangeEvent<any>) => void;
  handleSubmit: (event: React.MouseEvent) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    selectField: {
      marginLeft: theme.spacing(2)
    }
  })
);

const SelectInterview: React.FC<IDialog> = props => {
  const classes = useStyles();
  return (
    <Dialog onClose={props.handleClose} open={props.open}>
      <DialogContent>
        <FormControl>
          <Select
            native={true}
            variant="outlined"
            value={props.value}
            onChange={props.handleSelectedTime}
            className={classes.selectField}
          >
            <option value="">Please Select A Time</option>
            {props.interviews &&
              props.interviews.map((interview, index) => {
                return (
                  <option key={index} value={interview.id}>
                    {moment(interview.datetime).format(
                      "h:mm a on dddd MMMM Do, YYYY"
                    )}
                  </option>
                );
              })}
          </Select>
          <Button
            disabled={!props.value}
            className={classes.button}
            color="primary"
            size="small"
            onClick={props.handleSubmit}
            variant="text"
          >
            Submit
          </Button>
          <Button
            className={classes.button}
            onClick={props.handleClose}
            color="secondary"
            size="small"
            variant="text"
          >
            Cancel
          </Button>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
};

export default SelectInterview
