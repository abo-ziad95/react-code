import Karma from "@hatech/karma-core";
import React from "react";
import renderer from "react-test-renderer";
import Edit from "../../views/jobs/edit";

it("Edit Job renders correctly", () => {
  const editJob = renderer
    .create(
      <Karma layout="organization">
        <Edit />
      </Karma>
    )
    .toJSON();
  expect(editJob).toMatchSnapshot();
});
