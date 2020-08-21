# Karma Core

Karma Core is a React Provider Component that is intended to provide each micro-frontend application its core functionality such Context, Session Management, GraphQL Connection, and Responsive Layouts. To do so, the application is wrapped in a [Provider Component](https://reactjs.org/docs/context.html#contextprovider). This [Provider Component](https://reactjs.org/docs/context.html#contextprovider) is a [Organization Scoped Private Node Package](https://docs.npmjs.com/about-private-packages) stored within NPM. This means, in order to install the package locally, you must have an NPM account associated with the Karma Organization.

- Do you have access? [Click here to check](https://www.npmjs.com/package/@hatech/karma-core)
  - If you see a 404 page then you do NOT have access
  - If you see the Readme page then you DO have access
- How do you get access?
  - [Create a NPM account](https://docs.npmjs.com/creating-a-new-npm-user-account) if you do NOT already have one
  - Contact Kevin Li/Praneeth to add your user to the Karma Organization
  - Login to your npm account locally by running `npm login`
- How can I learn more about the [Karma Provider](https://www.npmjs.com/package/@hatech/karma-core) and its functionality
  - Once you are granted access to the [Karma Provider](https://www.npmjs.com/package/@hatech/karma-core) NPM Package you can view the Readme associated with the package for more details

## Example Usage

```
import Karma from "@hatech/karma-core";
import React from "react";

const App: React.FC = () => {
  return <Karma>Content</Karma>;
};

export default App;
```

## How To Use Context

Along with providing your application a responsive layout the Karma Provider also provides context data to your application via the [React Context API](https://reactjs.org/docs/context.html#contextprovider). The context provider value is an object consisting of two properties `state` and `dispatch`. If you're familiar with Redux then you understand the concept of state and the dispatching of an action. If not, no worries, below is an example usage of the context.

### Things to know before usage

- State is simply data temporarily stored in a React Component or in React Context. In this case we are referring to React Context. Data stored in React Context can be retrieved by any component within the Context Provider.
- Dispatch is a function which invokes a reducer and causes a change in state. Therefore, to change the `state` of context you must `dispatch` an action.

### Drawer Context Example

The Karma Provider applies a layout to the micro-frontend which includes a slideout menu drawer on tablet and mobile devices. The following example shows the use of both the `state` and `dispatch` properties of the context provider. Please remember the slideout menu is for tablet and mobile devices so for this to work you must view the application within a viewport less than 900px.

```
import { DrawerContext } from "@hatech/karma-core/context/drawer";
import Button from "@material-ui/core/Button";
import React from "react";

const Example: React.FC = () => {
  const { state, dispatch } = React.useContext(DrawerContext);
  const text = state === "main" ? "Close Drawer" : "Open Drawer";

  const handleClick = () => {
    dispatch({ type: "TOGGLE_DRAWER", payload: "main" });
  };

  return (
    <Button onClick={handleClick} variant="contained">
      {text}
    </Button>
  );
};

export default Example;
```

### Alerts Context Example

The Karma Provider allows you to quickly send a popup alert to the user via the `AlertsContext`. Below is an example of using the `dispatch` property of the context provider.

```
import { AlertsContext } from "@hatech/karma-core/context/alerts";
import Button from "@material-ui/core/Button";
import React from "react";

const Example: React.FC = () => {
  const { dispatch } = React.useContext(AlertsContext);

  const handleClick = () => {
    const dialog = { title: "Super Alert", body: "I'm an alert" };
    dispatch({ type: "ADD_ALERT", payload: dialog });
  };

  return (
    <Button onClick={handleClick} variant="contained">
      Add Alert
    </Button>
  );
};

export default Example;
```

### User Context Example

The Karma Provider allows you to retrieve data about the current logged in user from anywhere within the application. Below is an example of using the `state` property of the context provider.

```
import { UserContext } from "@hatech/karma-core/context/user";
import React from "react";

const Example: React.FC = () => {
  const { state } = React.useContext(UserContext);
  const text = state ? `Hello ${state.identity["cognito:username"]}` : "User is not logged in";
  return <div>{text}</div>;
};

export default Example;
```
# hatech-core
