import React from 'react';
import renderer from 'react-test-renderer';
import Karma from "@hatech/karma-core";
import Dashboard from "../../views/dashboard/dashboard";

it("Dashboard component renders correctly", () => {
    const dashBoard = renderer
        .create(<Karma><Dashboard/></Karma>)
        .toJSON();
    expect(dashBoard).toMatchSnapshot();
});