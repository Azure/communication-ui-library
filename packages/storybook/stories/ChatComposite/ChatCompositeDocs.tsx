// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatComposite } from '@azure/communication-react';
import { Title, Description, Heading, Source, Props } from '@storybook/addon-docs';
import React from 'react';

const containerText = require('!!raw-loader!./snippets/Container.snippet.tsx').default;
const customDataModelExampleContainerText =
  require('!!raw-loader!./snippets/CustomDataModelExampleContainer.snippet.tsx').default;
const customBehaviorExampleText = require('!!raw-loader!./snippets/CustomizeBehavior.snippet.tsx').default;

const hideTopicStatement = `
<ChatComposite options={{ topic: false}}>
`;
const showParticipantStatement = `
// Caution: the Participant Pane is a beta feature
<ChatComposite options={{ participantPane: true}}>
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ChatComposite</Title>
      <Description>
        ChatComposite brings together key components to provide a full chat experience out of the box.
      </Description>
      <Description>
        Note that ChatComposite has a min width and height of respectively 19.5rem and 20rem (312px x 320px, with
        default rem at 16px).
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
        here](https://developer.microsoft.com/fluentui#/styles/web/typography).
      </Description>

      <Heading>Icons</Heading>
      <Description>
        Custom icons can be applied to the Composite using `icons` prop exposed by the Composite. The `icons` prop
        accepts an object where you can provide a custom JSX element against an icon name key.
      </Description>

      <Heading>Hiding/Showing UI Elements</Heading>
      <Description>
        Some UI elements of the composite can be hidden if desired using the ChatAdapter `options` interface. Currently
        we support hiding the `Topic Header`:
      </Description>
      <Source code={hideTopicStatement} />
      <Description>
        You can also show a `Participant Pane` to the right hand side of the chat that has support for removing users.
        The Participant pane is a `beta` feature. Currently it does not support mobile views and is subject to breaking
        changes.
      </Description>
      <Source code={showParticipantStatement} />

      <Heading>Running in a Mobile browser</Heading>
      <Description>
        Unlike the CallComposite and MeetingComposite, the ChatComposite has no `formFactor` property. Instead the
        composite is responsive to the container it is in and should perform optimally on mobile and desktop
        automatically.
      </Description>

      <Heading>Custom Data Model</Heading>
      <Description>
        It is a primary tenet of Azure Communication Services that customers bring their own user identities. Customers
        then use the Azure Communication Services identity service to create corresponding authentication tokens for
        their users. The ChatComposite allows developers to easily inject custom data associated with these user
        identities. Look at the [example
        canvas](./?path=/story/composites-chat-customdatamodelexample--custom-data-model-example) to see how the name
        and avatar displayed for users can be provided by Contoso.
      </Description>
      <Description>Note that, by default, the initials text color is setup to `white`</Description>
      <Source code={customDataModelExampleContainerText} />
      <Description>
        See the [Custom data model example documentation](./?path=/docs/customuserdatamodel--page) to understand how
        custom data model can be injected for all the components in this UI library.
      </Description>

      <Heading>Customize Behavior</Heading>
      <Description>
        The `ChatAdapter` makes it possible to arbitrarily modify the communication between the `ChatComposite`
        component and the Azure Communication Services backend. This adds powerful customization possibilities. The
        [Customized Behavior Example](./?path=/story/composites-chat-custombehaviorexample--custom-behavior-example)
        shows a way to intercept messages entered by the user and modify them before sending them on to the backend.
      </Description>
      <Source code={customBehaviorExampleText} />

      <Heading>Joining existing Chat</Heading>
      <Description>
        The [join existing chat
        thread](./?path=/story/composites-chat-joinexistingchatthread--join-existing-chat-thread) provides an easy
        playground to join an existing Azure Communication Services chat thread. This is useful if you want to explore
        the composite with multiple users.
      </Description>

      <Heading>Chat Composite Props</Heading>
      <Props of={ChatComposite} />
    </>
  );
};
