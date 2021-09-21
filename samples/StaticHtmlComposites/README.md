# Basic sample for using CallComposite and ChatComposite on a plain HTML page

This sample shows how to embed the ready-to-use Calling and Chat composite components on your plain HTML page with a `<script>` tag. This is for you if your web app is not a React application but you still want to use our React components. The React parts are being hidden away behind helper functions inside a JavaScript bundle. The sample consists of the following files:

- `composites.js` exports two basic helper functions that use React to render the `CallComposite` or `ChatComposite` into a container HTML element.
- `services.js` are helpers to create a user and a token, as well as to create a chat thread and add the user to the thread. This sample makes requests to the `samples/Server`. In real-life you have to write your own minimal authenticated server.
- `webpack.config.js` bundles the scripts so that they can be included on your web page.
- `index.html` loads the script bundle, and instantiates the composites with the helper functions.

> *Note:* As for all Azure Communication Services applications, you will still need to write your own production service for secure [management of users and tokens](https://docs.microsoft.com/azure/communication-services/quickstarts/access-tokens?pivots=programming-language-javascript).

## Prerequisites

- An [Azure subscription](https://azure.microsoft.com/free/).
- An existing Communication Services resource, or [create one](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).

## Commands

### Install dependencies
```
rush update
```

### Bundle the app
```
rushx build
```

### Set your connection string

Replace the `ResourceConnectionString` in the `samples/Server/appsettings.json` file with the connection string from your Azure Communication Services resource, which is listed in the Azure Portal under *Keys*.

### Launch the servers
```
rushx start
```

The basic app is accessible on http://localhost:3000.

## Note about package versions

>  This sample uses the `@azure/communication-react` package from within this repo, which can slightly diverge from the `latest` package on npm. If you copy this sample to bootstrap your own app and use the public npm package, you might need to fix the call signatures in `composites.js` file. Alternatively, you can install the `dev` tagged package from npm which is updated daily and should likely match the in-repo version.


## Generate composite js bundles
```
rushx build
```
Get your own bundle according to the need:
dist/chatComposite.js
dist/callComposite.js

Please check index.html for sample code for these 2 composites

## Basic app

![Basic app screenshot](./app.png)
