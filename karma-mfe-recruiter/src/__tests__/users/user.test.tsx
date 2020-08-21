import React from 'react';
import renderer from 'react-test-renderer';
import Karma from "@hatech/karma-core";
import User from "../../views/users/user";

it("User Info renders correctly", () => {
    const user = renderer
        .create(<Karma><User/></Karma>)
        .toJSON();
    expect(user).toMatchSnapshot();
});