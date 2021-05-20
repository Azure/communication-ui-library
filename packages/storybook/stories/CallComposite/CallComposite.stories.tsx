// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Title, Description, Heading, Source, Props } from '@storybook/addon-docs/blocks';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { CallComposite } from 'react-composites';

import { COMPOSITE_FOLDER_PREFIX } from '../constants';

const containerText = require('!!raw-loader!./snippets/Container.snippet.tsx').default;
const serverText = require('!!raw-loader!./snippets/Server.snippet.tsx').default;

export default {
  title: `${COMPOSITE_FOLDER_PREFIX}/Call`,
  component: CallComposite,
  parameters: {
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
        CallComposite provides the UI for an *existing user* in an *existing group*. The user and group must be created
        beforehand. Typically, the user and group are created on a Contoso-owned service and provided to the client
        application that then passes it to the CallComposite.
      </Description>
      <Source code={serverText} />

      <Heading>Theming</Heading>
      <Description>
        CallComposite can be themed with Fluent UI themes, just like the base components. Look at the [CallComposite
        themes canvas](./?path=/story/composites-call--themes-canvas) to see theming in action or the [overall theming
        example](./?path=/docs/examples-themes--teams-theme-component) to see how theming works for all the components
        in this UI library.
      </Description>
    </>
  );
};
