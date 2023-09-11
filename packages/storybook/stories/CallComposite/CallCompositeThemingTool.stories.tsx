// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable import/no-duplicates */

import { CallComposite } from '@azure/communication-react';
import { Stack, ColorPicker, IColor, getColorFromString, IColorPickerStyles } from '@fluentui/react';

import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { useState, useEffect } from 'react';
import { COMPOSITE_FOLDER_PREFIX } from '../constants';
import { ArgsFrom, controlsToAdd, defaultCallCompositeHiddenControls } from '../controlsUtils';
import { Docs } from './CallCompositeDocs';
import { MockCallAdapter } from './themeToolUtils/CompositeMocks';
import { defaultMockCallAdapterState, defaultMockRemoteParticipant } from './themeToolUtils/ThemeCallCompositeUtils';

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
      page: () => Docs()
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
