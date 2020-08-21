import Karma from "@hatech/karma-core";
import React from "react";
import renderer from "react-test-renderer";
import Search from "../../views/candidates/search";

it("Search renders correctly", () => {
  const search = renderer
    .create(
      <Karma layout="organization">
        <Search />
      </Karma>
    )
    .toJSON();
  expect(search).toMatchSnapshot();
});
