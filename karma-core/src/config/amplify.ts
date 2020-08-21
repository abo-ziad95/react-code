const amplify = {
  Analytics: {
    disabled: true
  },
  Auth: {
    cookieStorage: {
      domain:
        process.env.NODE_ENV === "development" ? "localhost" : process.env.REACT_APP_COOKIE_DOMAIN,
      secure:
        process.env.REACT_APP_COOKIE_SECURE === "true" && process.env.NODE_ENV !== "development"
    },
    federationTarget: "COGNITO_USER_POOLS",
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    oauth: {
      domain: process.env.REACT_APP_COGNITO_DOMAIN,
      redirectSignIn: process.env.REACT_APP_REDIRECT_SIGN_IN,
      redirectSignOut: process.env.REACT_APP_REDIRECT_SIGN_OUT,
      responseType: "code",
      scope: ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"]
    },
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID
  },
  Storage: {
    AWSS3: {
      bucket: "karma-careers-uploads",
      region: "us-west-2"
    }
  }
};

export default amplify;
