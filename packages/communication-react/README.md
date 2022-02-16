# @Azure/communication-react

`@Azure/communication-react` is a react library that makes it easy for you to build modern communications user experiences using [Azure Communication Services](https://azure.microsoft.com/services/communication-services/). It gives you a library of react components built on top of [FluentUI](https://developer.microsoft.com/fluentui#/) that you can drop into your applications.

Read more about Azure Communication Services - UI Library [here](https://azure.github.io/communication-ui-library/?path=/story/overview--page).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource. [Create a Communication Services resource](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource?tabs=windows&pivots=platform-azp).
- [Node.js (14.19.0 and above)](https://nodejs.org/)

## Installing

`@azure/communication-react` is a React library. It requires a reasonable React environment.
The environment is already setup if you use [Create React App](https://create-react-app.dev/) or a similar tool to initialize your application.

```bash
npm i @azure/communication-react
```

### Beta-channel setup

`@azure/communication-react` is in the process of migrating the core Azure Communication Services dependencies to `peerDependencies` so that
you can most consistently use the API from the core libraries in your application.

If you are using a beta package (has a `beta` suffix) >= `@azure/communication-react@1.0.1-beta.2`, you need to install
the low-level client libraries as well:

```bash
npm i @azure/communication-calling@1.3.2-beta.1
npm i @azure/communication-chat@1.1.0
```

## Storybook

For complete documentation, quickstarts, and interactive components, check out our [Storybook](https://azure.github.io/communication-ui-library/?path=/story/overview--page).
