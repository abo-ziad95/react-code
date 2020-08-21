import Karma from "@hatech/karma-core";
import React from "react";
import renderer from "react-test-renderer";
import Profile from "../views/profile";

it("Profile(dashboard) renders correctly", () => {
  const profile= renderer
    .create(
      <Karma layout="organization">
        <Profile />
      </Karma>
    )
    .toJSON();
  expect(profile).toMatchSnapshot();
});
