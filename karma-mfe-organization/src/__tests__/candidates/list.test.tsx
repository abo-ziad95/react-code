import Karma from "@hatech/karma-core";
import React from "react";
import renderer from "react-test-renderer";
import ApplicantsList from "../../views/candidates/list";

it("ApplicantsList renders correctly", () => {
  const list = renderer
    .create(
      <Karma layout="organization">
        <ApplicantsList />
      </Karma>
    )
    .toJSON();
  expect(list).toMatchSnapshot();
});
