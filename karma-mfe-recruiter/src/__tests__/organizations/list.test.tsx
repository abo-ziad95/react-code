import React from 'react';
import renderer from 'react-test-renderer';
import Karma from "@hatech/karma-core";
import OrganizationsList from "../../views/organizations/list";

it("Organizations List renders correctly", () => {
    const organizationsList = renderer
        .create(<Karma><OrganizationsList/></Karma>)
        .toJSON();
    expect(organizationsList).toMatchSnapshot();
});