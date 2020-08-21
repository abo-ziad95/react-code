import Karma from "@hatech/karma-core";
import React from "react";
import renderer from "react-test-renderer";
import ApplicationView from "../../../views/application";

test("ApplyView to make sure it properly renders", () => {
  const component = renderer.create(
    <Karma layout="account">
      <ApplicationView />
    </Karma>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
