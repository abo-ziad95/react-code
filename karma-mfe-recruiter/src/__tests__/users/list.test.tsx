import React from 'react';
import UsersList from '../../views/users/list';
import renderer from 'react-test-renderer';
import Karma from "@hatech/karma-core";

it("Users List renders correctly", () => {
    const userList = renderer
        .create(<Karma><UsersList/></Karma>)
        .toJSON();
    expect(userList).toMatchSnapshot();
});