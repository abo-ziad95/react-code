import React from 'react';
import renderer from 'react-test-renderer';
import Karma from "@hatech/karma-core";
import InvitationsList from "../../../../views/organizations/members/invitations/list";

it("Invitations List renders correctly", () => {
    const invitationsList = renderer
        .create(<Karma><InvitationsList/></Karma>)
        .toJSON();
    expect(invitationsList).toMatchSnapshot();
});