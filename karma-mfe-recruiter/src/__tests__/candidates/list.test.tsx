import React from 'react';
import renderer from 'react-test-renderer';
import Karma from "@hatech/karma-core";
import CandidatesList from "../../views/candidates/list";

it("Candidates List renders correctly", () => {
    const candidatesList = renderer
        .create(<Karma><CandidatesList/></Karma>)
        .toJSON();
    expect(candidatesList).toMatchSnapshot();
});