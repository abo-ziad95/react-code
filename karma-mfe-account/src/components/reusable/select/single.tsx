import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

interface ISelectField {
  field?: string;
  test: string
  label: string;
  setField: React.Dispatch<React.SetStateAction<string>>;
  suggestions?: string[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

const SingleSelect: React.FC<ISelectField> = props => {
  const classes = useStyles({});

  const handleChange = (event: React.ChangeEvent<any>) => {
    props.setField(event.target.value);
  };

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <InputLabel>{props.label}</InputLabel>
        <Select data-test={props.test} onChange={handleChange} value={props.field || ""}>
          {props.suggestions &&
            props.suggestions.map(suggestion => {
              return (
                <MenuItem key={suggestion} value={suggestion}>
                  {suggestion}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
    </div>
  );
};

export default SingleSelect;
