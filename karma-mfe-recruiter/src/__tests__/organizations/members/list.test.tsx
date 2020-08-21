import React from 'react';
import renderer from 'react-test-renderer';
import Karma from "@hatech/karma-core";
import MembersList from "../../../views/organizations/members/list";

it("Members List renders correctly", () => {
    const membersList = renderer
        .create(<Karma><MembersList/></Karma>)
        .toJSON();
    expect(membersList).toMatchSnapshot();
});