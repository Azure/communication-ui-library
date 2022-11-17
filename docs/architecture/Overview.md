# Overview

This document provides an overview of the internal structure of this repository.

This repository houses the source code for [`@azure/communication-ui-library` package on NPM](https://www.npmjs.com/package/@azure/communication-react) along with associated tooling and supporting infrastructure (e.g. browser tests, sample applications etc.).

There is some overlap between this document and the conceptual sections in the user-facing documentation for `@azure/communication-ui-library`. Read the user-documentation before continuing to get a better understanding of the internals. Suggested reading:

- An [overview](https://azure.github.io/communication-ui-library/?path=/docs/overview--page) of the main offering.
- An understanding of the [UI composites](https://azure.github.io/communication-ui-library/?path=/docs/quickstarts-composites--page) and the [adapters](https://azure.github.io/communication-ui-library/?path=/docs/composite-adapters--page) that power them.
- An understanding of the [UI components](https://azure.github.io/communication-ui-library/?path=/docs/overview-uicomponents--page) and the [stateful data layer](https://azure.github.io/communication-ui-library/?path=/docs/statefulclient-overview--page) that powers them.

## Architecture

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
        │    │ Handlers                    Selectors │           │
        │    │   │                            │      │           │
        │    │   │                            │      │           │
        │    │   │                            │      │           │
        │    └───┼────────────────────────────┼──────┘           │
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

_edit on [asciiflow](https://asciiflow.com/#/share/eJzVlt1OwjAUx1%2FlpJcEMJoYlSthJmKMiQni1W7KVlmT0i5dhyDhLQwP4rVP45N4AAOiGysLH%2BOkabt2%2BeWcf3vajoikPUZqJOaCdypUewEpE0GHTOPgyCUDl9Suzk%2FLLhli7%2BziEnuGDQx%2BuOTr%2FfOIiutKrCGn%2FQI4ShoVKaiHoeAeNVzJzQBQgrrvg1FhRbA%2BE1B61KrPfaYjiCMuu9Ay1LCXWDiCM2miBEA7YtC%2BA0%2F1QiVn%2F3AJNAzL8MpNsByHDpc%2BIqNVABxqFdIkgVmDETnLiFKFXA9BdRqxMUqmESwhDhViutZaiQbVOSHPuKzqFklMD3N78sCiiHbZU6AZ9fNCqtVqmhq2EAvLgOy8TD422HMWkSVObx9yqHRc9Sxhyef1IimhsThOViOzBGVLlAFqUumL6UGZYC0mmGcUTu7Lm8KBiraJ%2FnucHtmfwV1m2KQQ4syapKs%2BI7yE3VNacvCuwQSd43JDAmoSCDaQfexCSzcAmnhfCrw8oXVznyyqJeiavsWaneCzqhfLn0dfxZtLvQUQyr2ZR0VQ2MLWQw5V0lzKYwvAERWXjMn4G%2FY7SRM%3D)_

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
        │   │    │ UI Components               │  │   │
        │   │    └─┬───────────────────────▲───┘  │   │
        │   │      │                       │      │   │
        │   │    ┌─┼───────────────────────┼───┐  │   │
        │   │    │ │   Component Bindings  │   │  │   │
        │   │    │ │                       │   │  │   │
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
        │   │    ┌─▼───────────────────────┼───┐  │   │
        │   │    │ StatefulClients         │   │  │   │
        │   │    └─────────────────────────┴───┘  │   │
        │   │                                     │   │
        │   └─────────────────────────────────────┘   │
        │                                             │
        │                                             │
        └─────────────────────────────────────────────┘

_edit on [asciiflow](https://asciiflow.com/#/share/eJzNlcFOwzAMhl%2FFyhGtl4GE2G30ws4T4pJLaAONlCVV40qbpr0F2oNwRDwNT0ImttKVJe0KLY2syJXyOc7v1FkTxRacTEgupHgMWBYlQS6CSC9SbQRyQ0ZEshXP7JI1JUtKJjdXlyNKVtYbX4%2Bth3yJ9oOSj5f34Rilys4QaoXaaJimqRQRQ6EVuMY3BRcQZpwhBxazFHlmnNBJqpAPciPUM2BSjVSi4F%2F0%2BZkD3M%2BsXIe6u097gtydnElZ0OeRCcOWpN3zQWDijOAgO5bcv28hs%2BIKqzLX0n9p29eGWZccR3GGqvWXW8gNt0LF9oc0JaxRBO%2B19Ee4YyqWlQ4y55JHqDPTa70bK9e%2B3v1bJYdqlu78YYDZ7%2Bap78Xxq3%2FoifsQ57O2j7ZmS734OEYd27BeTnov5vatmwL59oU52uf%2BKZehFEfdvLSwLu%2BuLpZH7ZpxkuzfKjk0H7%2BkhmOUbMjmE1qM9VQ%3D)_