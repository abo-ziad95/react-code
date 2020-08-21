import Karma from "@hatech/karma-core";
import React from "react";
import renderer from "react-test-renderer";
import CreateJob from "../../views/jobs/create";

it("CreateJob renders correctly", () => {
  const createJob = renderer
    .create(
      <Karma layout="organization">
        <CreateJob />
      </Karma>
    )
    .toJSON();
  expect(createJob).toMatchSnapshot();
});
