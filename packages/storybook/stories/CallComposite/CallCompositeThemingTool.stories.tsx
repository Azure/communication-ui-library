// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable import/no-duplicates */

import { CallComposite } from '@azure/communication-react';
import { Stack, ColorPicker, IColor, getColorFromString, IColorPickerStyles } from '@fluentui/react';

import { Description, Heading, Subheading, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { useState, useEffect } from 'react';
import { COMPOSITE_FOLDER_PREFIX } from '../constants';
import { ArgsFrom, controlsToAdd, defaultCallCompositeHiddenControls } from '../controlsUtils';
import { MockCallAdapter } from './themeToolUtils/CompositeMocks';
import { defaultMockCallAdapterState, defaultMockRemoteParticipant } from './themeToolUtils/ThemeCallCompositeUtils';

const docs = (): JSX.Element => {
  return (
    <Stack>
      <Title>Call Composite Theming Tool</Title>
      <Description>
        This Tool is to help with the customization of the Azure Communication Services Call Composite. Please see our
        CallComposite documentation for more information about how the props for our composite works.
      </Description>
      <Heading>Using the tool</Heading>
      <Description>
        On the preview tab of this page you will find the tool. You will be greeted by a CallComposite and a color
        picker. Currently our CallComposite takes its theme through a similar object as a Fluent theme. This tool is
        meant to be a playground for you to change those theme values without needing to run our CallComposite in your
        application. We provide a colour picker to find the hex values for the colours that you maybe are not bringing
        with you when approaching this tool.
      </Description>
      <Subheading>The Controls</Subheading>
      <Description>We have provided a couple of storybook controls to help with your customization.</Description>
      <ul className={'sbdocs sbdocs-p'}>
        <li>Call Page - This control is to select the current page of the CallComposite</li>
        <li>Theme - Here is where you can change the individual colors in the theme for the CallComposite</li>
      </ul>
      <Description>
        Using these controls you can navigate the CallComposite manually to each page to see how the theme you have
        created is applied. Once you have a theme you like you can use the `RAW` button in the `Theme` control to get
        the raw JSON object and copy it out. Once you have it copied you can dump it into the theme prop of the
        CallComposite you are using inside your application.
      </Description>
    </Stack>
  );
};

const storyControls = {
  callPage: controlsToAdd.callPage,
  theme: controlsToAdd.callCompositeTheme
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const white = getColorFromString('#ffffff')!;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ThemeToolStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  const gary = defaultMockRemoteParticipant('Gary');
  const Larry = defaultMockRemoteParticipant('Larry');
  const Berry = defaultMockRemoteParticipant('Berry');

  const remoteParticipants = [gary, Larry, Berry];

  const mockCallAdapterState = defaultMockCallAdapterState(remoteParticipants);

  const [color, setColor] = useState(white);
  const [callPage, setCallPage] = useState(args.callPage);
  mockCallAdapterState.page = callPage;
  const adapter = new MockCallAdapter(mockCallAdapterState);
  useEffect(() => {
    console.log('Setting call page to', args.callPage);
    setCallPage(args.callPage);
  }, [args.callPage]);
  console.log(adapter.getState().page);

  const updateColor = React.useCallback((ev: any, colorObj: IColor) => setColor(colorObj), []);
  return (
    <Stack tokens={{ childrenGap: '1rem' }} style={{ padding: '3rem' }}>
      <Stack horizontal tokens={{ childrenGap: '1rem' }}>
        <Stack style={{ width: '55rem', height: '25rem' }}>
          <CallComposite adapter={adapter} key={Math.random()} fluentTheme={args.theme} />
        </Stack>
        <Stack>
          <ColorPicker
            color={color}
            onChange={updateColor}
            showPreview={true}
            styles={colorPickerStyles}
            alphaType={'transparency'}
          ></ColorPicker>
        </Stack>
      </Stack>
    </Stack>
  );
};

export const themeTool = ThemeToolStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-themetool`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallComposite/Theming tool`,
  component: CallComposite,
  argTypes: {
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultCallCompositeHiddenControls
  },
  parameters: {
    docs: {
      //Prevent Docs auto scroll to top
      container: null,
      page: () => docs()
    }
  }
} as Meta;

const colorPickerStyles: Partial<IColorPickerStyles> = {
  panel: { padding: 12 },
  root: {
    maxWidth: 352,
    minWidth: 352
  },
  colorRectangle: { height: 268 }
};
