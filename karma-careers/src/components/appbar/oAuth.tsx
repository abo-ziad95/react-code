import Button from "@material-ui/core/Button";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Auth } from "aws-amplify";
import * as React from "react";
import { FaFacebookF, FaGoogle, FaLock } from "react-icons/fa";
import config from "../../config";
import useHistoryPush from "../../hooks/router/useHistoryPush";

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    marginRight: 12
  },
  facebook: {
    background: "#3B5998",
    margin: theme.spacing(1)
  },
  google: {
    background: "#DD4B39",
    margin: theme.spacing(1)
  },
  linkedin: {
    background: "#0077B5",
    margin: theme.spacing(1)
  }
}));

/**
 * Triggers the Amplify Federated Sign In process
 * @param customProvider Specifies which Oauth provider to use for sign in
 */

const onClick = (customProvider: string) => async () => {
  if (customProvider === "LinkedIn") {
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86bf4w9upwv1w4&scope=r_liteprofile%20r_emailaddress%20w_member_social&redirect_uri=${
      config.amplify.oauth.redirectSignIn
    }`;
    return;
  }
  await Auth.federatedSignIn({ customProvider });
};

/**
 * React Function Component that renders Material-UI Buttons
 * for user sign in
 * @param props React Function Component parameters
 */

const OAuth: React.FC = () => {
  const { handleClick } = useHistoryPush();
  const classes = useStyles();
  return (
    <div>
      <Button
        className={classes.facebook}
        color="primary"
        onClick={onClick("Facebook")}
        variant="contained"
      >
        <FaFacebookF className={classes.icon} />
        Facebook
      </Button>
      <Button
        className={classes.google}
        color="secondary"
        onClick={onClick("Google")}
        variant="contained"
      >
        <FaGoogle className={classes.icon} />
        Google
      </Button>
      <Button
        className={classes.linkedin}
        color="primary"
        onClick={handleClick("/login")}
        variant="contained"
        id="standardSignin"
      >
        <FaLock className={classes.icon} />
        Standard
      </Button>
    </div>
  );
};

export default OAuth;

/**
 * This will get used for linkedin
  const getUser = async () => {
    if (!location.search) {
      return;
    }

    const query = qs.parse(location.search.substr(1));
    const params = {
      code: query.code,
      redirect_uri: config.amplify.oauth.redirectSignIn
    };
    const url =
      "https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/oauth";
    const { data } = await axios.get(url, { params });
    setUser(data);
  };
*/
