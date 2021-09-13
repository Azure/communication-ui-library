// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallComposite } from '@azure/communication-react';
import { Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

const containerText = require('!!raw-loader!./snippets/Container.snippet.tsx').default;
const customDataModelExampleContainerText =
  require('!!raw-loader!./snippets/CustomDataModelExampleContainer.snippet.tsx').default;
const serverText = require('!!raw-loader!./snippets/Server.snippet.tsx').default;

const cssSnippet = `
html,
body,
#root {
  height: 100%;
}
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>CallComposite</Title>
      <Description>
        CallComposite brings together key components to provide a full calling experience out of the box.
      </Description>
      <Heading>Basic usage</Heading>
      <Description>
        There are two parts to the composite - a `CallComposite` react component and a `CallAdapter` that connects the
        react component to the backend APIs.
      </Description>
      <Description>
        The key thing to note is that initialization of `CallAdapter` is asynchronous. Thus, the initialization step
        requires special handling, as the example code below shows.
      </Description>
      <Source code={containerText} />

      <Heading>Prerequisites</Heading>
      <Description>
        CallComposite provides the UI for an *existing user* to join a call. The user must be created beforehand.
        Typically, the user and group call or teams meeting are created on a Contoso-owned service and provided to the
        client application that then passes it to the CallComposite.
      </Description>
      <Source code={serverText} />

      <Heading>Styling</Heading>
      <Description>
        CallComposite is designed to fill the space of the parent it is in. By default these examples put the composite
        in a container of a set height and width. If your composite is living outside of any parent container and you
        wish for it to fill the page, we recommend ensuring your react app is set to fill the screen by adding the
        following css to your primary css file:
      </Description>
      <Source code={cssSnippet} />

      <Heading>Theming</Heading>
      <Description>
        CallComposite can be themed with Fluent UI themes, just like the base components. Look at the [CallComposite
        theme example](./?path=/story/composites-call-themeexample--theme-example) to see theming in action or the
        [overall theming example](./?path=/docs/theming--page) to see how theming works for all the components in this
        UI library.
      </Description>

      <Heading>Custom Data Model</Heading>
      <Description>
        It is a primary tenet of Azure Communication Services that customers bring their own user identities. Customers
        then use the Azure Communication Services identity service to create corresponding authentication tokens for
        their users. The ChatComposite allows developers to easily inject custom data associated with these user
        identities. Look at the [example
        canvas](./?path=/story/composites-call-customdatamodelexample--custom-data-model-example) to see how the
        initials displayed for users can be provided by Contoso.
      </Description>
      <Description>Note that, by default, the initials text color is setup to `white`</Description>
      <Source code={customDataModelExampleContainerText} />
      <Description>
        See the [Custom data model example documentation](./?path=/docs/customuserdatamodel--page) to understand how
        custom data model can be injected for all the components in this UI library.
      </Description>

      <Heading>Fonts</Heading>
      <Description>
        Custom fonts can be applied to the CallComposite using the in built theming mechanism. Look at the
        [CallComposite themes canvas](./?path=/story/composites-call-themeexample--theme-example) to see custom fonts in
        action or the [overall theming example](./?path=/story/theming--page) to see how theming works for all the
        components in this UI library. Read more about fonts in [Fluent UI
        Typography](https://developer.microsoft.com/en-us/fluentui#/styles/web/typography).
      </Description>

      <Heading>Icons</Heading>
      <Description>
        Custom icons can be applied to the Composite using `icons` prop exposed by the Composite. The `icons` prop
        accepts an object where you can provide a custom JSX element against an icon name key.
      </Description>

      <Heading>Joining an existing Call</Heading>
      <Description>
        The [join existing call](./?path=/story/composites-call-joinexistingcall--join-existing-call) provides an easy
        playground to join an existing Azure Communication Services group call or an existing Teams meeting. This is
        useful if you want to explore the composite with multiple users.
      </Description>

      <Heading>Call Composite Props</Heading>
      <Props of={CallComposite} />
    </>
  );
};
