# @azure/communication-ui readme

Welcome! Thank you in advance for trying out the private preview of the Azure ACS UI SDK!

## UI SDK Storybook

We recommend looking at the storybook first to get an overview of the goodness available inside the npm package.

### Viewing the Storybook

It is available publicly here [storybook](https://azure.github.io/communication-ui-sdk)

### Using the Storybook

Storybook highlights the different parts of the SDK your project is able to consume:

1. **ACS Composites.** Turn-key solutions that fully incorporate end-to-end communication scenarios.
2. **UI Components.** FluentUI-based components that can be used to create your communication UI.
3. **Hooks.** Business logic components that do the heavy lifting communicating with the ACS SDK. These should be used to grab the necessary data from the SDK to drive your components.
4. **Providers.** Top-level entities that supply the react context used by the hooks.

For more information see our [official documentation](https://aka.ms/acs-ui-sdk).

## Installing the UI SDK

Copy the tarball file (azure-communication-ui-0.1.0.tgz) from this folder into the root of your project and run:

```bash
npm install --save ./azure-communication-ui-0.1.0.tgz
```

### Consuming SDK components in your code.

To use the sdk inside your project after installing, simply import from `'@azure/communication-ui'`.
For example:

```javascript
import { MediaGallery } from "@azure/communication-ui";
```

For more information take a look at the Storybook and at our [official documentation](https://aka.ms/acs-ui-sdk).

## We want to hear from you

Enjoy and send us any feedback through the private preview repository on [GitHub](https://github.com/Azure/communication-preview/issues/new/choose)