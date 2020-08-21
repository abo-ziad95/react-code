import Karma from "@hatech/karma-core";
import React from "react";
import renderer from "react-test-renderer";
import Members from "../../views/members";

it("Members renders correctly", () => {
  const members = renderer
    .create(
      <Karma layout="organization">
        <Members />
      </Karma>
    )
    .toJSON();
  expect(members).toMatchSnapshot();
});
