import Karma from "@hatech/karma-core";
import React from "react";
import renderer from "react-test-renderer";
import JobList from "../../views/jobs/list";

it("JobList renders correctly", () => {
  const list = renderer
    .create(
      <Karma layout="organization">
        <JobList />
      </Karma>
    )
    .toJSON();
  expect(list).toMatchSnapshot();
});
