import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/CancelOutlined";
import React from "react";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginTop: theme.spacing(2),
      paddingBottom: theme.spacing(0.75),
      paddingTop: theme.spacing(0.75)
    },
    chip: {
      borderColor: theme.palette.primary.dark,
      color: theme.palette.primary.main,
      marginBottom: theme.spacing(0.75),
      marginRight: theme.spacing(1.25),
      marginTop: theme.spacing(0.75)
    },
    chips: {
      display: "flex",
      flexWrap: "wrap"
    },
    deleteIcon: {
      fill: theme.palette.primary.light
    },
    formControl: {
      margin: theme.spacing(1),
      width: "100%"
    },
    root: {
      display: "flex",
      flexWrap: "wrap"
    }
  })
);

interface ITextField {
  items: string[];
  label: string;
  name: string;
  placeholder?: string;
  selections?: string[];
  test: string;
  value?: string;
  handleFieldChange(event: React.ChangeEvent<HTMLInputElement>): any;
  handleChipItems(event: React.ChangeEvent): void;
  handleChipDelete(items: string[], item: string): any;
}

export const TextFields: React.FC<ITextField> = props => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <TextField
        data-test={props.test}
        className={classes.formControl}
        fullWidth={true}
        label={props.label}
        margin="none"
        name={props.name}
        onBlur={props.handleChipItems}
        onChange={props.handleFieldChange}
        placeholder={props.placeholder}
        value={props.value || ""}
      />
      {props && (
        <Grid container={true} spacing={6}>
          <Grid item={true} xs={12}>
            {props.items &&
              props.items.map((item: string, index: number) => (
                <Chip
                  className={classes.chip}
                  deleteIcon={
                    <DeleteIcon
                      className={classes.deleteIcon}
                      id="chip-delete-icon"
                    />
                  }
                  id="chip-icon"
                  key={index}
                  label={item}
                  onDelete={props.handleChipDelete(props.items, item)}
                  variant="outlined"
                />
              ))}
          </Grid>
        </Grid>
      )}
    </div>
  );
};
