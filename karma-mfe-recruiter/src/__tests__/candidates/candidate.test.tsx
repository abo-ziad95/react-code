import React from 'react';
import renderer from 'react-test-renderer';
import Karma from "@hatech/karma-core";
import Candidate from "../../views/candidates/profile";

it("Candidate Info renders correctly", () => {
    const candidate = renderer
        .create(<Karma><Candidate/></Karma>)
        .toJSON();
    expect(candidate).toMatchSnapshot();
});