import Karma from "@hatech/karma-core";
import React from "react";
import renderer from "react-test-renderer";
import Edit from "../../views/settings/edit";

it("Edit Settings renders correctly", () => {
  const editSettings= renderer
    .create(
      <Karma layout="organization">
        <Edit />
      </Karma>
    )
    .toJSON();
  expect(editSettings).toMatchSnapshot();
});
