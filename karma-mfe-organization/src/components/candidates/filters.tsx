import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Dialog from "@material-ui/core/Dialog/Dialog";
import Divider from "@material-ui/core/Divider";
import React from "react";
import { TextFields, useStyles } from "../textField";

/**
 * A React Functional Component form that allows a candidate to input their qualifications
 */

const Filters = (props: any) => {
  const classes = useStyles();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    props.sort();
  };

  return (
    <Dialog fullWidth={true} onClose={props.handleCloseDialog} open={props.open}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader title="Qualifications" />
          <Divider />
          <CardContent>
            <div className="wrapper">
              <TextFields
                handleChipDelete={props.handleChipDelete}
                handleChipItems={props.handleChipItems}
                handleFieldChange={props.handleFieldChange}
                items={props.certifications}
                label="Certifications"
                name="certifications"
                placeholder="AWS Developer Associate or CCNA e.g."
                value={props.fields.certifications}
              />
              <TextFields
                handleChipDelete={props.handleChipDelete}
                handleChipItems={props.handleChipItems}
                handleFieldChange={props.handleFieldChange}
                items={props.languages}
                label="Languages"
                name="languages"
                placeholder="Spanish or Mandarin e.g."
                value={props.fields.languages}
              />
              <TextFields
                handleChipDelete={props.handleChipDelete}
                handleChipItems={props.handleChipItems}
                handleFieldChange={props.handleFieldChange}
                items={props.skills}
                label="Skills"
                name="skills"
                placeholder="Cloud Computing or Communication e.g."
                value={props.fields.skills}
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
            </div>
          </CardContent>
        </Card>
      </form>
    </Dialog>
  );
};

export default Filters;
