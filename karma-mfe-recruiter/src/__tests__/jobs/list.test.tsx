import React from 'react';
import renderer from 'react-test-renderer';
import Karma from "@hatech/karma-core";
import JobList from "../../views/jobs/list";

it("Jobs List renders correctly", () => {
    const jobsList = renderer
        .create(<Karma><JobList/></Karma>)
        .toJSON();
    expect(jobsList).toMatchSnapshot();
});