import Karma from "@hatech/karma-core";
import React from "react";
import renderer from "react-test-renderer";
import Board from "../../views/candidates/board";

it("Board renders correctly", () => {
  const board = renderer
    .create(
      <Karma layout="organization">
        <Board />
      </Karma>
    )
    .toJSON();
  expect(board).toMatchSnapshot();
});
