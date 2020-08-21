import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";

const muiTheme: ThemeOptions = {
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
        marginBottom: -6,
        marginRight: 0,
        marginTop: -6
      }
    },
    MuiDrawer: {
      paper: {
        background: "#fff",
        color: "#232323",
        width: 240
      },
      root: {
        width: 240
      }
    }
  },
  palette: {
    primary: {
      contrastText: "#fff",
      main: "#257FD2"
    },
    secondary: {
      contrastText: "#fff",
      main: "#e30613"
    }
  }
};

export default muiTheme;
