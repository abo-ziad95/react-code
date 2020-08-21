import React from 'react';
import renderer from 'react-test-renderer';
import Karma from "@hatech/karma-core";
import Search from "../../views/candidates/search";

it("Search component renders correctly", () => {
    const search = renderer
        .create(<Karma><Search/></Karma>)
        .toJSON();
    expect(search).toMatchSnapshot();
});