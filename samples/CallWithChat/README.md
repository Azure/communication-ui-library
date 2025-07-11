# Call with Chat Sample

🚧 Be advised we are currently working on polishing the samples in this repo. 🚧

## Overview

This is a sample application to show how we can use the `@azure/communication-react` package to build a Call with chat experience.
The client-side application is a React based user interface. Alongside this front-end is a NodeJS web application powered by ExpressJS that performs functionality like minting new user tokens for each call participant.

## Prerequisites

- [Visual Studio Code (Stable Build)](https://code.visualstudio.com/Download)
- [Node.js (16.19.0 and above)](https://nodejs.org/en/download/)
- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource). You'll need to record your resource **connection string** for this quickstart.

## Before running the sample for the first time

1. Open an instance of PowerShell, Windows Terminal, Command Prompt, or equivalent, and navigate to the directory that you'd like to clone the sample to and clone the repo.

    ```shell
    git clone https://github.com/Azure/communication-ui-library.git
    ```

1. Get the `Connection String` from the Azure portal. For more information on connection strings, see [Create an Azure Communication Resources](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource)
1. Once you get the `Connection String`, add the connection string to the **samples/Server/appsetting.json** file. Input your connection string in the variable: `ResourceConnectionString`.
1. Once you get the `Endpoint`, add the endpoint string to the **samples/Server/appsetting.json** file. Input your connection string in the variable: `EndpointUrl`.
1. Get the `identity` from the Azure portal. Click on `Identities & User Access Tokens` in Azure portal. Generate a user with `Chat` scope.
1. Once you get the `identity` string, add the identity string to the **samples/Server/appsetting.json** file. Input your identity string in the variable: `AdminUserId`. This is the server user to add new users to the chat thread.

## Local run

1. Install dependencies

    ```bash
    npm i -g @microsoft/rush
    rush install
    ```

1. Start the call with chat app

    ```bash
    cd samples/CallWithChat
    rushx start
    ```

    This will open a client server on port 3000 that serves the website files, and an api server on port 8080 that performs functionality like minting tokens for call participants.

## Additional Reading

- [Azure Communication Services - UI Library](https://azure.github.io/communication-ui-library/) - To learn more about what the `@azure/communication-react` package offers.
- [Azure Communication Calling SDK](https://docs.microsoft.com/azure/communication-services/concepts/voice-video-calling/calling-sdk-features) - To learn more about the calling web sdk
- [Azure Communication Chat SDK](https://docs.microsoft.com/en-us/azure/communication-services/concepts/chat/sdk-features) - to learn more about the chat features needed for the CallWithChatComposite.
- [FluentUI](https://developer.microsoft.com/fluentui#/) - Microsoft powered UI library
- [React](https://reactjs.org/) - Library for building user interfaces
- [Create a react app from scratch](https://react.dev/learn/build-a-react-app-from-scratch) - Create a react application from scratch
- [Create your first project with Vite](https://vite.dev/guide/#scaffolding-your-first-vite-project) - Create a react application with Vite. Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects.
