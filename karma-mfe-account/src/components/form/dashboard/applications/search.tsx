import parseUrl from "@hatech/karma-core/utils/parseUrl";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3)
    },
    search: {
      textAlign: "center"
    }
  })
);

const Search = () => {
  const classes = useStyles();
  const { protocal, domain } = parseUrl();
  const handleRedirect = () => {
    window.location.href = `${protocal}${domain}`;
  };
  return (
    <Card>
      <CardHeader title="Applications" />
      <Divider />
      <CardContent>
        <Container className={classes.search}>
          <Box width="1">
            <Typography variant="subtitle2">
              It appears you have not applied for any jobs
            </Typography>
          </Box>
          <Box width="1">
            <Button
              id="search-button"
              size="medium"
              variant="outlined"
              color="primary"
              onClick={handleRedirect}
              className={classes.button}
            >
              Now Let's find you a career
            </Button>
          </Box>
        </Container>
      </CardContent>
    </Card>
  );
};

export default Search;
