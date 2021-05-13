// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Title, Description, Heading, Source } from '@storybook/addon-docs/blocks';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { ChatComposite } from 'react-composites';
import { COMPOSITE_FOLDER_PREFIX } from '../constants';

const containerText = require('!!raw-loader!./snippets/Container.snippet.tsx').default;
const dataModelContainerText = require('!!raw-loader!./snippets/DataModelContainer.snippet.tsx').default;
const serverText = require('!!raw-loader!./snippets/Server.snippet.tsx').default;

export default {
  title: `${COMPOSITE_FOLDER_PREFIX}/Chat`,
  component: ChatComposite,
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

export { BasicCanvas } from './snippets/BasicCanvas.snippet';
export { DataModelCanvas } from './snippets/DataModelCanvas.snippet';
export { ThemesCanvas } from './snippets/ThemesCanvas.snippet';

const getDocs: () => JSX.Element = () => {
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
        created beforehand. Typically, the user and thread are created on a Contoso-owned service, and the `ChatConfig`
        is served to the client app that then passes it to the ChatComposite.
      </Description>
      <Source code={serverText} />
      <Heading>Theming</Heading>
      <Description>
        ChatComposite can be themed with Fluent UI themes, just like the base components. Look at the [ChatComposite
        themes canvas](./?path=/story/composites-chat--themes-canvas) to see theming in action or the [overall theming
        example](./?path=/docs/examples-themes--teams-theme-component) to see how theming works for all the components
        in this UI library.
      </Description>
      <Heading>Custom Data Model</Heading>
      <Description>
        It is a primary tenet of Azure Communication Services that customers bring their own user identities. Customers
        then use the Azure Communication Services identity service to create corresponding authentication tokens for
        their users. The ChatComposite allows developers to easily inject custom data associated with these user
        identities. Look at the [example canvas](./?path=/story/composites-chat--data-model-canvas) to see how the name
        and avatar displayed for users can be provided by Contoso.
      </Description>
      <Source code={dataModelContainerText} />
      <Description>
        See the [custom data model documentation](?path=/story/custom-user-data-model--page) to understand how custom
        data model can be injected for all the components in this UI library.
      </Description>
    </>
  );
};
