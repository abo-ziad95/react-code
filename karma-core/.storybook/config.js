import { configure } from "@storybook/react";
import { addDecorator } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";

const loadStories = () => {
  const r = require.context("../src/stories/", true, /\.(js|tsx)$/);
  r.keys().forEach(r);
};

addDecorator(withInfo);
configure(loadStories, module);
