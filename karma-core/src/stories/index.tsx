import { storiesOf } from "@storybook/react";
import React from "react";
import Karma from "..";

storiesOf("Layouts", module)
  .add("Account", () => <Karma layout="account">Content</Karma>)
  .add("Recruiter", () => <Karma layout="recruiter">Content</Karma>)
  .add("Authentication", () => <Karma layout="authentication">Content</Karma>)
  .add("Organization", () => <Karma layout="organization">Content</Karma>);
