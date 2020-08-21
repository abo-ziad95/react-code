const config = {
  amplify: {
    aws_cognito_identity_pool_id: "us-west-2:2324055f-ccca-46d0-a95f-304c38de490f",
    aws_cognito_region: "us-west-2",
    aws_user_pools_id: "us-west-2_nb5ddqNKS",
    aws_user_pools_web_client_id: "6tifq0g8d9ii0p81ibioprptse",
    federationTarget: "COGNITO_USER_POOLS",
    oauth: {
      domain: "karma.auth.us-west-2.amazoncognito.com",
      redirectSignIn: process.env.REACT_APP_REDIRECT_URL,
      redirectSignOut: `${process.env.REACT_APP_REDIRECT_URL}?signout`,
      responseType: "code",
      scope: ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"]
    },
    Storage: {
      AWSS3: {
        bucket: "micone-resumes",
        region: "us-west-2"
      }
    }
  },
  api: process.env.REACT_APP_API,
  muiTheme: {
    overrides: {
      MuiAppBar: {
        colorPrimary: {
          backgroundColor: "#232323",
          color: "#fff"
        }
      },
      MuiCardActions: {
        root: {
          justifyContent: "flex-end"
        }
      },
      MuiCardHeader: {
        action: {
          alignSelf: "auto",
          marginRight: 0,
          marginTop: -6,
          marginBottom: -6
        }
      }
    },
    palette: {
      primary: {
        contrastText: "#fff",
        main: "#0069ff"
      },
      secondary: {
        contrastText: "#fff",
        main: "#18c746"
      }
    }
  },
  title: process.env.REACT_APP_SITE_NAME || "React Boilerplate"
};

export default config;
