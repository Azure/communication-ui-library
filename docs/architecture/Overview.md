# Overview

This document provides an overview of the internal structure of this repository.

This repository houses the source code for [`@azure/communication-react` package on NPM](https://www.npmjs.com/package/@azure/communication-react) along with associated tooling and supporting infrastructure (e.g. browser tests, sample applications etc.).

There is some overlap between this document and the conceptual sections in the user-facing documentation for `@azure/communication-react`. Read the user-documentation before continuing to get a better understanding of the internals. Suggested reading:

- An [overview](https://azure.github.io/communication-ui-library/?path=/docs/overview--docs) of the main offering.
- An understanding of the [UI composites](https://azure.github.io/communication-ui-library/?path=/docs/composites-get-started--docs) and the [adapters](https://azure.github.io/communication-ui-library/?path=/docs/composites-adapters--docs) that power them.
- An understanding of the [UI components](https://azure.github.io/communication-ui-library/?path=/docs/components-overview--docs) and the [stateful data layer](https://azure.github.io/communication-ui-library/?path=/docs/stateful-client-overview--docs) that powers them.

These documents are geared towards customers. As such, they focus primarily on getting off the ground using the different APIs available in the library and some intricacies of _how_ to use the API.

Documentation in this directory dives into the _why_.

## Architecture - layering

At a high level, the library exposes two distinct layers of APIs.

- A lower-abstraction API in the form of UI components, stateful ACS modality clients (chat / calling) and bindings between the two. The focus in this layer is in giving the customers maximum flexibility. The API makes the default use-cases easier but not at the cost of making non-default use-cases impossible.

- A higher-abstraction API in the form of UI composites, powered by adapters. This layer addresses specific end-to-end use-cases well. While this layer does provide customers some customizability, it choses to make some non-default use-cases hard or impossible. By restricting the set of supported use-cases, this layer is able to support the covered use-cases more extensively and with minimal effort from customers.

The user-facing documentation in [storybook](https://azure.github.io/communication-ui-library) starts with the composite layer, as it's the easiest API to use for new customers. It then progressively reveals the components API as an alternative for power-users.

This document starts with the component layer, as it forms the foundation for the composite layer in addition to being a public API customers can use.

## Component layer

The component layer provides a set of UI components and bindings that allow the components to work with the ACS backend services. The architecture follows [unidirectional data flow](./ComponentDesign.md).

A typical application that uses the component layer API looks as follows:

        ┌────────────────────────────────────────────────────────┐
        │                                                        │
        │  Contoso Application                                   │
        │   * Add top-level Providers using StatefulClients      │
        │   * Use UI components in app, with component bindings  │
        │    ┌──────────────────────────────────────┐            │
        │    │  UI Components                       │            │
        │    │   * Buttons                          │            │
        │    │   * CallControlBar                   │            │
        │    │   * VideoGallery                     │            │
        │    │   * MessageThread                    │            │
        │    │   * ...                              │            │
        │    │                                      │            │
        │    └───┬────────────────────────────▲─────┘            │
        │        │                            │                  │
        │        │                            │                  │
        │    ┌───┼────────────────────────────┼──────┐           │
        │    │   │   Component Bindings       │      │           │
        │    │   │                            │      │           │
        │    │ Handlers                   Selectors  │           │
        │    │  * onToggleCamera()            │      │           │
        │    │  * onSendMessage()             │      │           │
        │    │  ...                           │      │           │
        │    └───┬────────────────────────────┼──────┘           │
        │        │                            │                  │
        │        │                            │                  │
        │    ┌───▼────────────────────────────┴──────┐           │
        │    │  StatefulClients                      │           │
        │    │   * StatefulCallingClient             │           │
        │    │   * StatefulChatClient                │           │
        │    │    ┌───────────────────────────────┐  │           │
        │    │    │  Headless SDK                 │  │           │
        │    │    │  @azure/communication-calling │  │           │
        │    │    │  @azure/communication-chat    │  │           │
        │    │    └───────────────────────────────┘  │           │
        │    │                                       │           │
        │    └───────────────────────────────────────┘           │
        │                                                        │
        └────────────────────────────────────────────────────────┘

### Stateful clients

Directories:
- [`calling-stateful-client`](../../packages/calling-stateful-client/)
- [`chat-statefule-client`](../../packages/chat-stateful-client/)

Ultimately, this library depends on the headless SDKs to interact with ACS backend services ([calling](https://www.npmjs.com/package/@azure/communication-calling) and [chat](https://www.npmjs.com/package/@azure/communication-chat)).

- The stateful clients are thin wrappers that are API compatible with the primary clients from the headless packages.
- The primary contribution of the stateful clients is that they cache all state updates from the backend and expose the entire backend state as a single rooted immutable directed acyclic graph. This way of exposing cached state allows the UI to use references to nodes in the state graph as proxies for the structure of data under the nodes.
- The stateful wrappers also support better error handling by [bubbling up errors to the application in a variety of ways](./ErrorReporting.md).

### UI components

Directories:
- [`react-components`](../../packages/react-components/)

The other end of the component layer is a set of highly customizable (mostly) pure UI components. These UI components are agnostic of ACS concepts (and in particular the stateful clients) and are entirely driven by data and callback props defined within this packlet. See [this related doc](./CustomizableComponent.md) for some inspiration on how to design good UI components.

### Bindings

The two parts of the component layer - stateful clients and UI components define their own API. The binding layer provides the bridge that connects these two.

- [Selectors](./WritingSelectors.md) effeciently bind UI component data props to specific nodes in the immutable state exposed by the stateful layer. Selectors are setup to (1) avoid unnecessary component rerenders, and (2) avoid costly computation to determine when the component needs to rerender.
- Handlers bind UI component callback props to methods exposed by the stateful layer.

For both selectors and handlers, the library exposes a very simple API for customers wanting to connect the UI components and the stateful clients without any customization - a single `usePropsFor` hook. The library also exposes a more verbose API for sophisticated use-cases. Power users retain the freedom to arbitrarily modify the bindings, or provide their own to get the behavior they desire. This progressive disclosure of detail allows customers to do simple things easily without limiting more complex scenarios.

## Composite layer

The library includes three UI composites, that bring together the UI components into somewhat customizable hero scenarios:

- [`CallComposite`](../../packages/react-composites/src/composites/CallComposite/) implements a single PSTN / 1:N / group / teams interop call flow; powered by `CallAdapter`.
- [`ChatComposite`](../../packages/react-composites/src/composites/ChatComposite/) implements a single chat session flow; powered by `ChatAdapter`.
- [`CallWithChatComposite`](../../packages/react-composites/src/composites/CallWithChatComposite/) brings together the two composites above to support a single call flow that includes an associated chat thread, powered by `CallWithChatAdapter`.

An application that leverages one of the composites looks as follows:

        ┌─────────────────────────────────────────────┐
        │ Contoso Application                         │
        │  * Create adapters                          │
        │  * Create composite using the adapters      │
        │   ┌─────────────────────────────────────┐   │
        │   │ UI Composites                       │   │
        │   │  * CallComposite                    │   │
        │   │  * ChatComposite                    │   │
        │   │  * CallWithChatComposite            │   │
        │   │    ┌─────────────────────────────┐  │   │
        │   │    │ Internal: UI Components     │  │   │
        │   │    └─┬───────────────────────▲───┘  │   │
        │   │      │                       │      │   │
        │   │    ┌─┴───────────────────────┴───┐  │   │
        │   │    │ Internal: Component Bindings│  │   │
        │   │    │ ┼                       ┼   │  │   │
        │   │    │Handlers            Selectors│  │   │
        │   │    └─┬───────────────────────┬───┘  │   │
        │   │      │                       │      │   │
        │   └──────┼───────────────────────┼──────┘   │
        │          │                       │          │
        │   ┌──────┴───────────────────────┼──────┐   │
        │   │ Adapters                     │      │   │
        │   │  * CallAdapter               │      │   │
        │   │  * ChatAdapter               │      │   │
        │   │  * CallWithChatAdapter       │      │   │
        │   │      │                       │      │   │
        │   │    ┌─▼───────────────────────┴───┐  │   │
        │   │    │ Internal: Stateful Clients  │  │   │
        │   │    └─────────────────────────────┘  │   │
        │   │                                     │   │
        │   └─────────────────────────────────────┘   │
        │                                             │
        │                                             │
        └─────────────────────────────────────────────┘

The composite API is split into two parts. The UI composite corresponds to the UI components from the lower-level API.
- Unlike the various components exported as individual React components, the composite consists of a single React component that renders the entire composite throughout the experience.
- Unlike the UI components, the composite is more stateful / less pure and has complex business logic specific to the scenario.
- Composite API is much more limited than components. The intent is to maintain some freedom of iterative improvement by reducing the exposed API. For example, while it is possible to provide a theme to color the component, it is not possible to style indvidual parts of the UI freely.

Similar to UI components, the composite does not directly interact with ACS backend services. Instead, it is powered by the corresponding adapter.
- The adapter provides a unified, simplified API surface on top of the stateful clients.
  - The API is unified by exposing a single interface with all the required methods instead of multiple objects with seprate concerns.
  - The API is simplified by limiting the API to only those methods and state that is needed by the specific composite.
- Internally, the implementation contains a bridge that converts the adapter API back into the bindings API, allowing the composite to use the UI components bound to the bridged bindings API.