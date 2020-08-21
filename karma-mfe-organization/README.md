# Karma MFE Organization

This repo was created to serve as a boilerplate for the rapid creation of micro-frontend applications. This boilerplate was built utilizing the [React Javascript Library](https://reactjs.org) with [Typescript](https://www.typescriptlang.org) and requires minimal configuration to standup locally.

## How to standup the application locally

#### PreRequesites

- You must have the required [enviornment variables](#enviornment-variables)
- You must have an npm account with access to the npm package [@hatech/karma-core](#hatech-npm-packages)
- That's it!

#### Step 1 - Clone the repo locally

```bash
git clone https://github.com/hatech/karma-mfe-organization.git
cd ./karma-mfe-organization
```

#### Step 2 - Create a env.local file

Create a .env.local file within the root directory. Then, paste the [enviornment variables](#enviornment-variables) within the file.

#### Step 3 - Install the dependencies

Reminder - The [@hatech/karma-core](#hatech-npm-packages) dependency are [Organization Scoped Private Node Packages](https://docs.npmjs.com/about-private-packages) stored within NPM. This means, in order to install these packages locally, you must have an NPM account associated with the HATech Organization.

```bash
npm login
npm install
```

#### Step 4 - Start the application

```bash
npm start
```

## Enviornment Variables

Below is an example of the required enviornment variables. The values below can be gathered from the [PaymentHub Cognito User Pool](https://us-west-2.console.aws.amazon.com/cognito/users/?region=us-west-2#/pool/us-west-2_xU0D1FZkb/details?_k=fzusc9) and [PaymentHub Cognito Federated Identity Pool](https://us-west-2.console.aws.amazon.com/cognito/pool/?region=us-west-2&id=us-west-2:3f8906ec-6c3d-4af7-81b2-935e708a4fdd) OR simply contact Kevin Li/Praneeth for the .env.local file.

```bash
# .env.local
REACT_APP_COOKIE_DOMAIN=           # App Domain
REACT_APP_COOKIE_SECURE=           # If App Domain HTTPS true/false
REACT_APP_DOMAIN=                  # Cognito Domain
REACT_APP_IDENTITY_POOL_ID=        # Identity Pool Id
REACT_APP_REDIRECT_SIGN_IN=        # Cognito OAuth Callback URL
REACT_APP_REDIRECT_SIGN_OUT=       # Cognito OAuth Logout URL
REACT_APP_REGION=                  # Cognito Region
REACT_APP_SITE_TITLE=              # Title of application
REACT_APP_USER_POOL_ID=            # Cognito User Pool Id
REACT_APP_USER_POOL_WEB_CLIENT_ID= # Cogntio Web Client Id
REACT_APP_API=                     # Graph API Url
REACT_APP_API_KEY=                 # API Key
```

## HATech NPM Packages

To provide each micro-frontend application its core functionality such Context, Session Management, a GraphQL Client, and Responsive Layouts the application is wrapped in two [Provider Components](https://reactjs.org/docs/context.html#contextprovider). These [Provider Components](https://reactjs.org/docs/context.html#contextprovider) are [Organization Scoped Private Node Packages](https://docs.npmjs.com/about-private-packages) stored within NPM. This means, in order to install the package locally, you must have an NPM account associated with the HATech Organization.

- Do you have access? [Click here to check](https://www.npmjs.com/package/@hatech/karma-core)
  - If you see a 404 page then you do NOT have access
  - If you see the Readme page then you DO have access
- How do you get access?
  - [Create a NPM account](https://docs.npmjs.com/creating-a-new-npm-user-account) if you do NOT already have one
  - Contact Anthony to add your user to the HATech Organization
  - Login to your npm account locally by running `npm login`
- How can I learn more about the [HATech Provider](https://www.npmjs.com/package/@hatech/karma-core) and its functionality
  - Once you are granted access to the [HATech Provider](https://www.npmjs.com/package/@hatech/karma-core) NPM Package you can view the Readme associated with the package for more details