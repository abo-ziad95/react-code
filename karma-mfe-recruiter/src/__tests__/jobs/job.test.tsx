import React from 'react';
import renderer from 'react-test-renderer';
import Karma from "@hatech/karma-core";
import Job from "../../views/jobs/job";

it("Job Info renders correctly", () => {
    const job = renderer
        .create(<Karma><Job/></Karma>)
        .toJSON();
    expect(job).toMatchSnapshot();
});