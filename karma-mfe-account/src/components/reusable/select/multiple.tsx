import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import DeleteIcon from "@material-ui/icons/CancelOutlined";
import React from "react";

interface ISelectField {
  fields: string[];
  test: string;
  label: string;
  setFields: React.Dispatch<React.SetStateAction<string[]>>;
  suggestions?: string[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

const MultipleSelect: React.FC<ISelectField> = props => {
  const classes = useStyles();

  const handleDelete = (values: string[], valueDeleted: string) => (
    event: React.MouseEvent
  ) => {
    const filteredValues = values.filter(
      (value: string) => value !== valueDeleted
    );
    props.setFields(filteredValues);
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    props.setFields(event.target.value as string[]);
  };

  const handleRender = (values?: string[]) => (event: any): React.ReactNode => {
    if (!values) {
      return;
    } else {
      return (
        <div className={classes.chips}>
          {values.map(value => (
            <Chip
              className={classes.chip}
              deleteIcon={
                <DeleteIcon
                  className={classes.deleteIcon}
                  id="chip-delete-icon"
                />
              }
              id="chip-icon"
              key={value}
              label={value}
              onDelete={handleDelete(values, value)}
              variant="outlined"
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <InputLabel>{props.label}</InputLabel>
        <Select
          fullWidth={true}
          data-test={props.test}
          multiple={true}
          native={false}
          onChange={handleChange}
          renderValue={handleRender(props.fields)}
          value={props.fields || ""}
        >
          {props.suggestions &&
            props.suggestions.map(suggestion => {
              return (
                <MenuItem key={suggestion} value={suggestion} id="suggestion">
                  {suggestion}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultipleSelect;
