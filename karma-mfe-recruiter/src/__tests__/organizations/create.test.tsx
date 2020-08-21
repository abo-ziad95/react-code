import React from 'react';
import renderer from 'react-test-renderer';
import Karma from "@hatech/karma-core";
import CreateOrganization from "../../views/organizations/create";

it("Create Organization Form renders correctly", () => {
    const createOrganizationForm = renderer
        .create(<Karma><CreateOrganization/></Karma>)
        .toJSON();
    expect(createOrganizationForm).toMatchSnapshot();
});