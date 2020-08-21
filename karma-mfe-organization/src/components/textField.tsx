import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";

export const useStyles = makeStyles({
  button: {
    marginTop: 16,
    paddingBottom: 6,
    paddingTop: 6,
  },
  chip: {
    borderColor: "#4692c4",
    color: "#4692c4",
    marginRight: 10,
    marginTop: 5,
  },
  valuesArray: {
    border: "solid",
    borderColor: "#4692c4"
  }
});

interface ITextField {
  items: string[];
  label: string;
  name: string;
  placeholder?: string;
  select?: boolean;
  selections?: string[];
  value?: string;
  handleFieldChange(event: React.ChangeEvent<HTMLInputElement>): any;
  handleChipItems(event: React.ChangeEvent): void;
  handleChipDelete(items: string[], index: number, item: string): any;
}

export const TextFields: React.FC<ITextField> = props => {
  const classes = useStyles();
  return (
    <div>
      <TextField
        fullWidth={true}
        label={props.label}
        margin="none"
        name={props.name}
        onChange={props.handleFieldChange}
        onBlur={props.handleChipItems}
        select={props.select}
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
                id={item}
                key={index}
                label={item}
                onDelete={props.handleChipDelete(props.items, index, item)}
                variant="outlined"
              />
            ))}
          </Grid>
        </Grid>
      )}
    </div>
  );
};

interface ISelect {
  selections: string[];
  items?: string[];
  item?: string;
  label: string;
  name: string;
  placeholder?: string;
  value?: string;
  handleFieldChange(event: React.ChangeEvent): void;
  handleChipItems(event: React.ChangeEvent): void;
  handleChipDelete(items: string[], index: number, item: string): any;
}

export const Select: React.FC<ISelect> = props => {
  const classes = useStyles();

  return (
    <div>
      <TextField
        fullWidth={true}
        label={props.label}
        margin="normal"
        name={props.name}
        onBlur={props.handleChipItems}
        onChange={props.handleFieldChange}
        placeholder={props.label}
        select={true}
        value={props.value || ""}
      >
        {props.selections.map((selection, index) => (
          <MenuItem key={index} value={selection}>
            {selection}
          </MenuItem>
        ))}
      </TextField>
      {props && props.items && (
        <Grid container={true} spacing={6}>
          <Grid item={true} xs={12}>
            {props.items.map((item: string, index: number) => (
              <Chip
                className={classes.chip}
                id={item}
                key={index}
                label={item}
                onDelete={
                  props &&
                  props.handleChipDelete(
                    props.items ? props.items : [],
                    index,
                    item
                  )
                }
                variant="outlined"
              />
            ))}
          </Grid>
        </Grid>
      )}
    </div>
  );
};
