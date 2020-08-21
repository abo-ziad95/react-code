import React from 'react';
import renderer from 'react-test-renderer';
import Karma from "@hatech/karma-core";
import Organization from "../../views/organizations/organization";

it("Organization Info renders correctly", () => {
    const organization = renderer
        .create(<Karma><Organization/></Karma>)
        .toJSON();
    expect(organization).toMatchSnapshot();
});