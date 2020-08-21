import Karma from "@hatech/karma-core";
import React from "react";
import renderer from "react-test-renderer";
import InvitationsList from "../../views/members/invitations";

it("InvitationsList renders correctly", () => {
  const list = renderer
    .create(
      <Karma layout="organization">
        <InvitationsList />
      </Karma>
    )
    .toJSON();
  expect(list).toMatchSnapshot();
});
