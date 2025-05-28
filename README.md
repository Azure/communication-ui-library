![ui-library-banner-image.png](./docs/images/ui-library-banner-image.png)

# Azure Communication Services UI Library

[![Storybook](https://raw.githubusercontent.com/storybooks/brand/master/badge/badge-storybook.svg)](https://azure.github.io/communication-ui-library)
[![azure-communication-react npm version](https://badge.fury.io/js/%40azure%2Fcommunication-react.svg)](https://www.npmjs.com/package/@azure/communication-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
[![CI build status](https://github.com/Azure/communication-ui-library/workflows/CI/badge.svg?branch=main)](https://github.com/Azure/communication-ui-library/actions/workflows/ci.yml?query=branch%3Amain)

The Azure Communication Services UI Library is a collection of JavaScript libraries designed to help you easily build fast, responsive communication web applications.

Explore interactive storybook pages in our documentation 📖 to try out features and examples, and kickstart your development journey 🚀.

## Getting Started

If you're wondering where to start, here are a few scenarios to guide you:

- **What is Azure Communication Services?**
  - Dive into our conceptual documentation on [Azure Communication Services](https://docs.microsoft.com/azure/communication-services/overview), [Client-Server Architecture](https://docs.microsoft.com/azure/communication-services/concepts/client-and-server-architecture), [Authentication](https://docs.microsoft.com/azure/communication-services/concepts/authentication), [Calling](https://docs.microsoft.com/azure/communication-services/concepts/voice-video-calling/about-call-types), and [Chat](https://docs.microsoft.com/azure/communication-services/concepts/chat/concepts?branch=pr-en-us-152137).
  
- **I want to see what this library can do!**
  - Explore our [Storybook](https://azure.github.io/communication-ui-library) and [Sample Apps](#samples).
  
- **I want to write my own communication application**
  - Start with our [comprehensive documentation](https://aka.ms/acsstorybook) to make the best choices for your application.
  
- **I want more information on the available npm packages**
  - Check out our [npm packages](#npm-packages) on offer.
  
- **I want to contribute and submit a fix for a package in this repo**
  - Refer to our [contributing guide](./docs/contributing-guide/1.%20getting-set-up.md) for the steps to get started.

## NPM Packages

### @azure/communication-react

This React library provides UI components, simplifying the development of modern communication apps using [Azure Communication Services](https://azure.microsoft.com/services/communication-services/).

## Samples

Explore [Storybook](https://azure.github.io/communication-ui-library) to try out the UI Library today!

## Data Collection

The software may collect information about you and your use of the software and send it to Microsoft. Microsoft may use this information to provide services and improve our products and services. You may turn off the telemetry as described below. You can learn more about data collection and use in the help documentation and Microsoft’s [privacy statement](https://go.microsoft.com/fwlink/?LinkID=824704). For more information on the data collected by the Azure SDK, please visit the [Telemetry Guidelines](https://azure.github.io/azure-sdk/general_azurecore.html#telemetry-policy) page.

### Telemetry Configuration

Telemetry collection is on by default when using the `useAzureCommunication...Adapter` hooks or the `createAzureCommunication...Adapter`

To opt out it is recommended developers:

- Use components directly. Learn how to [use components](https://azure.github.io/communication-ui-library/?path=/docs/components-get-started--docs)
- Create a custom custom adapter.

This will disable telemetry for all methods going to ACS.

Example of how to create a custom `ChatAdapter`.

```typescript
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { ChatAdapter, ChatComposite } from '@azure/communication-react';
import { ChatClient, ChatThreadClient } from '@azure/communication-chat';

class CustomChatAdapter implements ChatAdapter {
  private client: ChatClient;
  private threadClient: ChatThreadClient;
  
  constructor(chatClient: ChatClient, chatThreadClient: ChatThreadClient) {
      this.client = chatClient;
      this.threadClient = chatThreadClient;
  }

  fetchInitialData(): Promise<void> {
    ...
  }

  ...
}

const endpointUrl = '<Azure Communication Services Resource Endpoint>';
const token = '<Azure Communication Services Access Token>';
const threadId = '<Chat Thread Id>';
const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(token));
const chatThreadClient = chatClient.getChatThreadClient(threadId);

const chatAdapter = new CustomChatAdapter(chatClient, chatThreadClient);

return (
  <ChatComposite adapter={chatAdapter} />
)

```

## Contributing to the Packages or Samples

Join us in contributing to this open source library. Get started by checking out our [contributing guide](./docs/contributing-guide/1.%20getting-set-up.md).

We look forward to building an amazing open source library with you!

## Further Reading

- [Repository Documentation](./docs/README.md)
- [Conceptual Documentation](https://aka.ms/acsstorybook)
- [Quick-start Documentation](https://azure.github.io/communication-ui-library/?path=/story/quickstarts-composites--page)