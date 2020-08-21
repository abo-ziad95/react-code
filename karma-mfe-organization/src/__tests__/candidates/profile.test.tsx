import Karma from "@hatech/karma-core";
import React from "react";
import renderer from "react-test-renderer";
import ProfileView from "../../views/candidates/profile";

it("ProfileView renders correctly", () => {
  const profile = renderer
    .create(
      <Karma layout="organization">
        <ProfileView />
      </Karma>
    )
    .toJSON();
  expect(profile).toMatchSnapshot();
});
