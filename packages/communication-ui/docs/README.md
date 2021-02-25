# @azure/communication-ui readme

Welcome! Thank you in advance for trying out the private preview of the Azure ACS UI SDK!

## UI SDK Storybook

We recommend running the storybook first to get an overview of the goodness available inside the npm package.

### Viewing the Storybook

There are two ways to view the storybook:

1. Simple: double click the `index.html` storybook file inside `storybook-static/` folder.
   **Note:** Due to limitations with the SDK, some features will not work inside the Storybook because the ACS SDK requires the webpage to be served over https.
2. Serve over https:
   - Ensure [Node.Js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) is installed in your system. You can check by running `npm -v` and ensure a version is returned.
   - Navigate to where you have downloaded this folder
     ```
     cd <PATH_TO_FOLDER>
     ```
   - Install [https-localhost](https://www.npmjs.com/package/https-localhost) npm package that will be used to serve the storybook over https.
     ```
     npm i -g --only=prod https-localhost
     ```
   - Start the server
     ```
     serve ./storybook-static/
     ```
   - View the storybook at: https://localhost/

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