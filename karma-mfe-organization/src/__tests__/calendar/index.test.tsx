import Karma from "@hatech/karma-core";
import React from "react";
import renderer from "react-test-renderer";
import CalendarView from "../../views/candidates/calendar";

test("Calendar renders correctly", () => {
  const component = renderer.create(
    <Karma layout="authentication">
      <CalendarView />
    </Karma>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
