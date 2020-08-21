import Karma from "@hatech/karma-core";
import React from "react";
import renderer from "react-test-renderer";
import DashboardView from "../../../views/dashboard";

test("ApplyView to make sure it properly renders", () => {
  const component = renderer.create(
    <Karma layout="account">
      <DashboardView />
    </Karma>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
