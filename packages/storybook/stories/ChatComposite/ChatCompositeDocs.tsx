// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Title, Description, Heading, Source } from '@storybook/addon-docs';
import React from 'react';

const containerText = require('!!raw-loader!./snippets/Container.snippet.tsx').default;
const customDataModelExampleContainerText =
  require('!!raw-loader!./snippets/CustomDataModelExampleContainer.snippet.tsx').default;
const customBehaviorExampleText = require('!!raw-loader!./snippets/CustomizeBehavior.snippet.tsx').default;
const serverText = require('!!raw-loader!./snippets/Server.snippet.tsx').default;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ChatComposite</Title>
      <Description>
        ChatComposite brings together key components to provide a full chat experience out of the box.
      </Description>
      <Heading>Basic usage</Heading>
      <Description>
        There are two parts to the composite - a `ChatComposite` react component and a `ChatAdapter` that connects the
        react component to the backend APIs.
      </Description>
      <Description>
        The key thing to note is that initialization of `ChatAdapter` is asynchronous. Thus, the initialization step
        requires special handling, as the example code below shows.
      </Description>
      <Source code={containerText} />

      <Heading>Prerequisites</Heading>
      <Description>
        ChatComposite provides the UI for an *existing user* in an *existing thread*. Thus, the user and thread must be
        created beforehand. Typically, the user and thread are created on a Contoso-owned service and authentication
        tokens are served to the client application that then passes it to the ChatComposite.
      </Description>
      <Source code={serverText} />

      <Heading>Theming</Heading>
      <Description>
        ChatComposite can be themed with Fluent UI themes, just like the base components. Look at the [ChatComposite
        themes canvas](./?path=/story/composites-chat-themeexample--theme-example) to see theming in action or the
        [overall theming example](./?path=/story/theming--page) to see how theming works for all the components in this
        UI library.
      </Description>

      <Heading>Fonts</Heading>
      <Description>
        Custom fonts can be applied to the ChatComposite using the in built theming mechanism. Look at the
        [ChatComposite themes canvas](./?path=/story/composites-chat-themeexample--theme-example) to see custom fonts in
        action or the [overall theming example](./?path=/story/theming--page) to see how theming works for all the
        components in this UI library. Read more about fonts in [Fluent UI Typography
        here](https://developer.microsoft.com/en-us/fluentui#/styles/web/typography).
      </Description>

      <Heading>Custom Data Model</Heading>
      <Description>
        It is a primary tenet of Azure Communication Services that customers bring their own user identities. Customers
        then use the Azure Communication Services identity service to create corresponding authentication tokens for
        their users. The ChatComposite allows developers to easily inject custom data associated with these user
        identities. Look at the [example canvas](./?path=/story/composites-chat--custom-data-model-example) to see how
        the name and avatar displayed for users can be provided by Contoso.
      </Description>
      <Source code={customDataModelExampleContainerText} />
      <Description>
        See the [Custom data model example documentation](./?path=/docs/customuserdatamodel--page) to understand how
        custom data model can be injected for all the components in this UI library.
      </Description>

      <Heading>Customize Behavior</Heading>
      <Description>
        The `ChatAdapter` makes it possible to arbitrarily modify the communication between the `ChatComposite`
        component and the Azure Communication Services backend. This adds powerful customization possibilities. The
        [Customized Behavior Example](./?path=/story/composites-chat--custom-behavior-example) shows a way to intercept
        messages entered by the user and modify them before sending them on to the backend.
      </Description>
      <Source code={customBehaviorExampleText} />

      <Heading>Joining existing Chat</Heading>
      <Description>
        The [join existing chat thread](./?path=/story/composites-chat--join-existing-chat-thread) provides an easy
        playground to join an existing Azure Communication Services chat thread. This is useful if you want to explore
        the composite with multiple users.
      </Description>
    </>
  );
};
