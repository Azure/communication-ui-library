# Calling Stateful Sample

![Homepage](./Media/loginscreen.png)

🚧 Be advised we are currently working on polishing the samples in this repo. 🚧

## Overview

This is a sample application to show how we can use the `@azure/communication-ui` package to build a calling experience.
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

1. Start the calling app

    ```bash
    cd samples\CallingStateful
    rushx start
    ```

    This will open a client server on port 3000 that serves the website files, and an api server on port 8080 that performs functionality like minting tokens for call participants.

## Making a Call

When you start the app you will be greeted with a login screen.

![loginscreen](./Media/loginscreen.png)

You have two choices here. 

1. Login as a CTE user - See our CTE [documentation](https://azure.github.io/communication-ui-library/?path=/docs/communicationasteamsuser--page) for more instructions on how to login
2. Login as a ACS user - Just enter a name the server will do the rest

Once you have login you will be on the home page. To make a call you can simply enter the id of any user in the `Acs or Teams user ID` field. This can be the id of an Azure Communication Services user in your resrouce's scope. Or a Teams user from an org that you have [federated your resource](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/voice-video-calling/get-started-teams-call-queue?pivots=platform-web) with.

![Homepage](./Media/homescreen.png)

Then hit the `Start Call` button and the call should begin to the user. Using this app in another window with another user you can use the integrated IncomingCallNotifications to answer this call if you call their provided ID. **This is recommended for the fastest testing experience.**

### PSTN

To make a PSTN call you need to provide an alternate caller ID in the `Alternate Caller ID` field. Then either type in the number you wish to dial with the number pad, or enter the number in the dialpad's field on your own.


## Additional Reading

- [Azure Communication Services - UI Library](https://azure.github.io/communication-ui-library/) - To learn more about what the `@azure/communication-react` package offers.
- [Azure Communication Calling SDK](https://docs.microsoft.com/azure/communication-services/concepts/voice-video-calling/calling-sdk-features) - To learn more about the calling web sdk
- [FluentUI](https://developer.microsoft.com/fluentui#/) - Microsoft powered UI library
- [React](https://reactjs.org/) - Library for building user interfaces
- [Create-React-App](https://create-react-app.dev/) - Boilerplate React code to help with a majority of React style single page applications.
