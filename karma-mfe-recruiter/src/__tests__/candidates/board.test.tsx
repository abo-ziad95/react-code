import React from 'react';
import renderer from 'react-test-renderer';
import Karma from "@hatech/karma-core";
import Board from "../../views/candidates/board";

it("Board component renders correctly", () => {
    const board = renderer
        .create(<Karma><Board/></Karma>)
        .toJSON();
    expect(board).toMatchSnapshot();
});