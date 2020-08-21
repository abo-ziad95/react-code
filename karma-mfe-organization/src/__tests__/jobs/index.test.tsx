import Karma from "@hatech/karma-core";
import React from "react";
import renderer from "react-test-renderer";
import Job from "../../views/jobs";

it("Job renders correctly", () => {
  const job = renderer
    .create(
      <Karma layout="organization">
        <Job />
      </Karma>
    )
    .toJSON();
  expect(job).toMatchSnapshot();
});
