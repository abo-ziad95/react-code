import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import * as React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useReactRouter from "use-react-router";
import Breadcrumbs from "../../../components/breadcrumbs";
import Layout from "../../../components/layout/index";
import usePostRequest from "../../../hooks/api/usePostRequest";
import useTextField from "../../../hooks/form/useTextField";
import useHistoryPush from "../../../hooks/router/useHistoryPush";
import useGetOrganization from "../../../hooks/useGetOrganization";
import Menu from "../menu";

const styleReactQuill = {
  height: "300px",
  width: "100%",
  display: "inline-block"
};

const Create: React.FC = () => {
  const organization = useGetOrganization();
  const { handleClick } = useHistoryPush();
  const { post } = usePostRequest();
  const { push } = useHistoryPush();
  const { match } = useReactRouter();
  const { id } = match.params as { id: string };
  const [wysiwyg, setWysiwyg] = React.useState();
  const cityTextField = useTextField("city", "City");
  const stateTextField = useTextField("state", "State");
  const addressTextField = useTextField("address", "Street Address");
  const titleTextField = useTextField("title", "Job Title");
  const zipTextField = useTextField("zip", "Zip");

  const handleWysiwygChange = (value: string) => {
    setWysiwyg(value);
  };

  const handleSubmit = async () => {
    if (!organization) {
      return;
    }

    const body = {
      address: addressTextField.value,
      city: cityTextField.value,
      description: wysiwyg,
      organization: organization.id,
      state: stateTextField.value,
      title: titleTextField.value,
      zip: zipTextField.value
    };

    const url = `https://4xdih7rc7f.execute-api.us-west-2.amazonaws.com/v1/jobs`;
    const { status } = await post(url, {}, body);
    if (status === 201) {
      push(`/organizations/${id}/jobs`);
    }
  };

  const breadcrumbs = [
    {
      primary: organization ? organization.name : "",
      path: `/organizations/${organization ? organization.id : undefined}`
    },
    { primary: "Jobs", path: `/organizations/${id}/jobs` },
    { primary: "Post New Job" }
  ];

  return (
    <Layout
      menuComponent={<Menu />}
      title={organization ? organization.name + " | Post a new job" : undefined}
    >
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="wrapper">
        <Grid container={true} spacing={3} justify="center">
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Card>
              <CardHeader title="Create a Job Posting" />
              <Divider />
              <CardContent>
                <div className="wrapper">
                  <Grid container={true} spacing={3} justify="center">
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField {...titleTextField.attributes} />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField {...addressTextField.attributes} />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField {...cityTextField.attributes} />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={2} lg={2} xl={2}>
                      <TextField {...stateTextField.attributes} />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={4} lg={4} xl={4}>
                      <TextField {...zipTextField.attributes} />
                    </Grid>
                    <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactQuill
                        value={wysiwyg || ""}
                        onChange={handleWysiwygChange}
                        style={styleReactQuill}
                      />
                    </Grid>
                  </Grid>
                </div>
                <CardActions>
                  <Button
                    onClick={handleClick(`/organizations/${id}/jobs`)}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={handleSubmit}
                    variant="contained"
                  >
                    Submit
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Create;
